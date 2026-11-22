#!/usr/bin/env python3
"""
CUET Students API
=================
The CUET students directory as a read-only JSON API, served next to the other
endpoints of this site under /cuet.

The responses are the same as the ones on https://cuet.sayed.app - the same
fields, the same names, the same search behaviour (md/mohammad, bin/ibn).

Backed by one SQLite file, cuet/cuet.sqlite, a copy of the site's database.
It is opened read-only, so the API can never change the data.

Blueprint prefix: /cuet
"""

import os
import re
import sqlite3
import threading
from pathlib import Path

from flask import Blueprint, jsonify, request

# ── Blueprint ──────────────────────────────────────────────────────────────
cuet_bp = Blueprint('cuet', __name__, url_prefix='/cuet')

# ── Paths ──────────────────────────────────────────────────────────────────
CUET_DB_PATH = Path(__file__).parent / 'cuet' / 'cuet.sqlite'

# ── Thread-local connection ────────────────────────────────────────────────
_local = threading.local()


def get_cuet_db_connection():
    """One read-only connection per thread."""
    conn = getattr(_local, 'conn', None)
    if conn is None:
        db_uri = f'file:{CUET_DB_PATH.resolve()}?mode=ro'
        try:
            conn = sqlite3.connect(db_uri, uri=True, check_same_thread=False)
        except sqlite3.OperationalError:
            conn = sqlite3.connect(str(CUET_DB_PATH), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        _local.conn = conn
    return conn


def _query(sql, params=()):
    return [dict(r) for r in get_cuet_db_connection().execute(sql, params).fetchall()]


def _one(sql, params=()):
    row = get_cuet_db_connection().execute(sql, params).fetchone()
    return dict(row) if row else None


# ── The same table as the site ─────────────────────────────────────────────
DEPARTMENTS = [
    {'code': '01', 'slug': 'ce',  'short': 'CE',   'name': 'Civil Engineering'},
    {'code': '02', 'slug': 'eee', 'short': 'EEE',  'name': 'Electrical & Electronic Engineering'},
    {'code': '03', 'slug': 'me',  'short': 'ME',   'name': 'Mechanical Engineering'},
    {'code': '04', 'slug': 'cse', 'short': 'CSE',  'name': 'Computer Science & Engineering'},
    {'code': '05', 'slug': 'urp', 'short': 'URP',  'name': 'Urban & Regional Planning'},
    {'code': '06', 'slug': 'arch', 'short': 'ARCH', 'name': 'Architecture'},
    {'code': '07', 'slug': 'pme', 'short': 'PME',  'name': 'Petroleum & Mining Engineering'},
    {'code': '08', 'slug': 'ete', 'short': 'ETE',  'name': 'Electronics & Telecommunication Engineering'},
    {'code': '09', 'slug': 'mie', 'short': 'MIE',  'name': 'Mechatronics & Industrial Engineering'},
    {'code': '10', 'slug': 'wre', 'short': 'WRE',  'name': 'Water Resources Engineering'},
    {'code': '11', 'slug': 'bme', 'short': 'BME',  'name': 'Biomedical Engineering'},
    {'code': '12', 'slug': 'mme', 'short': 'MME',  'name': 'Materials & Metallurgical Engineering'},
    {'code': '00', 'slug': 'unknown', 'short': 'N/A', 'name': 'Department not published'},
]
DEPT_BY_CODE = {d['code']: d for d in DEPARTMENTS}
DEPT_BY_SLUG = {d['slug']: d for d in DEPARTMENTS}
ALIASES = {'wrp': 'wre', 'cwr': 'wre', 'mse': 'mme'}

# A real CUET student ID is seven digits. The pre-2012 intakes carry a hash
# instead of a class roll, so they are not matched by an ID search.
ID_RE = re.compile(r'^\d{2}(\d{5}|\d{2}[a-z]{3}|[a-z]{5})$')

SYNONYMS = {
    'md': ['mohammad', 'muhammad'],
    'mohammad': ['md'],
    'muhammad': ['md'],
    'mst': ['most', 'musammat'],
    'most': ['mst'],
    'min': ['minur'],
    'minim': ['minur'],
    'bin': ['ibn'],
    'ibn': ['bin'],
}


def dept_label(dept, batch=None):
    """Code 12 was Materials Science & Engineering up to batch 22."""
    if dept['code'] == '12' and batch and int(batch) <= 22:
        return {'short': 'MSE', 'name': 'Materials Science & Engineering'}
    return {'short': dept['short'], 'name': dept['name']}


def api_dept(dept, batch=None):
    label = dept_label(dept, batch)
    return {'code': dept['code'], 'slug': dept['slug'], 'short': label['short'], 'name': label['name']}


def dept_text(dept, batch=None):
    """The legacy flat department string."""
    name = dept_label(dept, batch)['name']
    return name if name.startswith('Department') else f'Department of {name}'


def clean_name(name):
    return re.sub(r'\s+', ' ', name or '').strip()


def merit_text(m):
    v = (m or '').strip()
    return '' if (not v or v == 'A FAILURE') else v


def normalize_query(q):
    return re.sub(r'[\u2010-\u2015\u2212]', '-', q or '')


def escape_like(s):
    return s.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')


# ── Responses ──────────────────────────────────────────────────────────────
def api_student(s):
    dept = DEPT_BY_CODE.get(s['dept_code'])
    return {
        'id': s['studentid'],
        'name': clean_name(s['name']),
        'department': api_dept(dept, s['batch']) if dept else None,
        'batch': s['batch'],
        'session': s['session'],
        'class_roll': int(s['class_roll']) if s['class_roll'] else None,
        'admission_roll': s['admission_roll'] or None,
        'admission_merit': merit_text(s['admission_merit']) or None,
        'url': f"https://cuet.sayed.app/{s['studentid']}",
    }


def json_response(payload, status=200):
    """The site's JSON shape, with the site's CORS."""
    response = jsonify(payload)
    response.status_code = status
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'public, max-age=300, s-maxage=86400'
    return response


def api_error(status, code, message):
    response = jsonify({'error': {'code': code, 'message': message}})
    response.status_code = status
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Cache-Control'] = 'no-store'
    return response


# ── Queries (the same SQL as the site) ─────────────────────────────────────
COLS = 'name, studentid, dept_code, class_roll, admission_roll, admission_merit, batch, session'


def get_student(student_id):
    return _one(f'SELECT {COLS} FROM students WHERE studentid = ?', (student_id,))


def get_overview():
    rows = _query(
        'SELECT batch, code, session, count, updated FROM class_counts ORDER BY batch DESC, code ASC'
    )
    batches = []
    by_batch = {}
    departments = {}
    total = 0
    for r in rows:
        dept = DEPT_BY_CODE.get(r['code'])
        if not dept:
            continue
        total += r['count']
        b = by_batch.get(r['batch'])
        if b is None:
            b = {'batch': r['batch'], 'session': r['session'], 'count': 0, 'classes': []}
            by_batch[r['batch']] = b
            batches.append(b)
        b['count'] += r['count']
        b['classes'].append({**r, 'dept': dept})
        d = departments.get(r['code'])
        if d is None:
            d = {'dept': dept, 'count': 0, 'classes': []}
            departments[r['code']] = d
        d['count'] += r['count']
        d['classes'].append(r)
    return {
        'total': total,
        'batches': batches,
        'departments': [departments[c] for c in DEPT_BY_CODE if c in departments],
    }


def get_class(batch, code):
    return _query(
        f'SELECT {COLS} FROM students WHERE batch = ? AND dept_code = ? ORDER BY studentid',
        (batch, code),
    )


def search_students(q, batch=None, code=None, limit=100):
    where = []
    params = []
    query = normalize_query(q.strip())
    if re.fullmatch(r'\d{1,7}', query):
        # an ID prefix: 25 -> batch 25, 2504 -> CSE of batch 25
        where.append('studentid BETWEEN ? AND ?')
        params += [query.ljust(7, '0'), query.ljust(7, '9')]
        where.append('class_roll IS NOT NULL')
    elif ID_RE.match(query):
        where.append('studentid = ?')
        params.append(query)
    else:
        words = [w for w in re.split(r'[\s.\-()]+', query.lower()) if w]
        if not words:
            return [], False
        key = max(words, key=len)
        # the longest word (and the words it is also written as) picks the
        # candidates out of the indexed name_words table
        variants = [key] + SYNONYMS.get(key, [])
        where.append(
            'studentid IN (SELECT studentid FROM name_words WHERE '
            + ' OR '.join(['(word >= ? AND word < ?)'] * len(variants)) + ')'
        )
        for v in variants:
            params += [v, v[:-1] + chr(ord(v[-1]) + 1)]
        # every word has to appear in the name, written the way it is written
        # or the way it is often written
        for word in words[:6]:
            wvars = [word] + SYNONYMS.get(word, [])
            where.append('(' + ' OR '.join(["name LIKE ? ESCAPE '\\'"] * len(wvars)) + ')')
            for v in wvars:
                params.append(f'%{escape_like(v)}%')
    if batch:
        where.append('batch = ?')
        params.append(batch)
    if code:
        where.append('dept_code = ?')
        params.append(code)
    if not where:
        return [], False
    params.append(limit + 1)
    rows = _query(
        f'SELECT {COLS} FROM students WHERE {" AND ".join(where)} '
        'ORDER BY batch DESC, studentid ASC LIMIT ?',
        tuple(params),
    )
    return rows[:limit], len(rows) > limit


# ── Endpoints ──────────────────────────────────────────────────────────────
@cuet_bp.route('/health')
def health():
    row = _one('SELECT COUNT(*) AS n FROM students')
    return json_response({
        'status': 'ok',
        'service': 'cuet-students',
        'students': row['n'] if row else 0,
        'time': __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat(),
    })


@cuet_bp.route('/api/v1/students/<student_id>')
def v1_student(student_id):
    if not ID_RE.match(student_id):
        return api_error(400, 'invalid_id', 'A student ID is 7 characters, e.g. 2504001.')
    s = get_student(student_id)
    if not s:
        return api_error(404, 'not_found', f'No student with ID {student_id}.')
    return json_response({'data': api_student(s)})


@cuet_bp.route('/api/v1/search')
def v1_search():
    q = (request.args.get('q') or '').strip()[:80]
    batch = request.args.get('batch') or ''
    dept_param = request.args.get('dept') or ''
    try:
        limit = min(max(int(request.args.get('limit') or 20), 1), 100)
    except ValueError:
        limit = 20
    if not q or (len(q) < 2 and not q.isdigit()):
        return api_error(400, 'invalid_query',
                         'Pass q with at least 2 characters (a name) or digits (an ID prefix).')
    if batch and not re.fullmatch(r'\d{2}', batch):
        return api_error(400, 'invalid_batch', 'batch is two digits, e.g. 25.')
    dept = None
    if dept_param:
        dept = DEPT_BY_SLUG.get(ALIASES.get(dept_param.lower(), dept_param.lower()))
        if not dept:
            return api_error(400, 'invalid_dept', 'Unknown dept. See /cuet/api/v1/departments for slugs.')
    rows, more = search_students(q, batch or None, dept['code'] if dept else None, limit)
    return json_response({
        'data': [api_student(s) for s in rows],
        'meta': {
            'query': q,
            'batch': batch or None,
            'dept': dept['slug'] if dept else None,
            'count': len(rows),
            'limit': limit,
            'has_more': more,
        },
    })


@cuet_bp.route('/api/v1/batches')
def v1_batches():
    overview = get_overview()
    data = [
        {
            'batch': b['batch'],
            'session': b['session'],
            'students': b['count'],
            'departments': [
                {**api_dept(c['dept'], b['batch']), 'students': c['count']} for c in b['classes']
            ],
        }
        for b in overview['batches']
    ]
    return json_response({'data': data})


@cuet_bp.route('/api/v1/batches/<batch>/<dept>')
def v1_batch_class(batch, dept):
    if not re.fullmatch(r'\d{2}', batch):
        return api_error(400, 'invalid_batch', 'batch is two digits, e.g. 25.')
    d = DEPT_BY_SLUG.get(ALIASES.get(dept.lower(), dept.lower()))
    if not d:
        return api_error(400, 'invalid_dept', 'Unknown dept. See /cuet/api/v1/departments for slugs.')
    rows = get_class(batch, d['code'])
    if not rows:
        return api_error(404, 'not_found', f'No students in {d["short"]} batch {batch}.')
    return json_response({
        'data': [api_student(s) for s in rows],
        'meta': {
            'batch': batch,
            'session': rows[0]['session'],
            'department': api_dept(d, batch),
            'count': len(rows),
        },
    })


@cuet_bp.route('/api/v1/departments')
def v1_departments():
    overview = get_overview()
    data = []
    for d in overview['departments']:
        batch = d['classes'][0]['batch'] if d['classes'] else None
        data.append({
            **api_dept(d['dept'], batch),
            'students': d['count'],
            'batches': [
                {'batch': c['batch'], 'session': c['session'], 'students': c['count']} for c in d['classes']
            ],
        })
    return json_response({'data': data})


# ── Legacy endpoints (the old flat shape) ──────────────────────────────────
@cuet_bp.route('/api/student/<student_id>')
def legacy_student(student_id):
    if not ID_RE.match(student_id):
        return api_error(400, 'invalid_id', 'A student ID is 7 characters.')
    s = get_student(student_id)
    if not s:
        return api_error(404, 'not_found', f'No student with ID {student_id}.')
    dept = DEPT_BY_CODE.get(s['dept_code'])
    return json_response({
        'name': clean_name(s['name']),
        'studentid': s['studentid'],
        'department': dept_text(dept, s['batch']) if dept else None,
        'admission_roll': s['admission_roll'] or None,
        'admission_merit': s['admission_merit'] or None,
        'batch': s['batch'],
        'session': s['session'],
    })


@cuet_bp.route('/api/student/search')
def legacy_search():
    q = (request.args.get('query') or '').strip()[:80]
    if len(q) < 2:
        return api_error(400, 'invalid_query', 'Pass query with at least 2 characters.')
    rows, _ = search_students(q, limit=50)
    results = []
    for s in rows:
        dept = DEPT_BY_CODE.get(s['dept_code'])
        results.append({
            'name': clean_name(s['name']),
            'studentid': s['studentid'],
            'department': dept_text(dept, s['batch']) if dept else None,
            'batch': s['batch'],
        })
    return json_response({'results': results})

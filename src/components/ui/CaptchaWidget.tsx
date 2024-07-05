"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const scriptLink =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileRenderParameters = {
  sitekey: string;
  action?: string;
  cData?: string;
  callback?: (token: string) => void;
  "error-callback"?: (error: any) => void;
  "expired-callback"?: () => void;
  tabindex?: number;
  theme?: "light" | "dark" | "auto";
  language?: string;
};

type CaptchaProps = Partial<TurnstileRenderParameters> & {
  onWidgetId?: (widgetId: string) => void;
};

export default function CaptchaWidget(props: CaptchaProps) {
  const {
    sitekey,
    "error-callback": errorCallback,
    "expired-callback": expiredCallback,
    ...rest
  } = props;

  const widgetID = useRef<string>();
  const [isError, setIsError] = useState(false);

  function retry() {
    setIsError(false);
  }

  function onError(e?: string | Error) {
    console.log(`Captcha error`, e);
    setIsError(true);
    if (errorCallback) {
      errorCallback(e);
    }
  }

  function renderWidget() {
    try {
      const sitekeyToUse =
        sitekey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
      if (window.turnstile) {
        widgetID.current = window.turnstile.render("#captcha-container", {
          ...rest,
          sitekey: sitekeyToUse,
          "error-callback": onError,
          "expired-callback": expiredCallback,
        });
        if (widgetID.current && props.onWidgetId) {
          props.onWidgetId(widgetID.current);
        }
        if (!widgetID.current) {
          throw new Error(
            `turnstile.render returned widgetID=${widgetID.current}`
          );
        }
      }
    } catch (e: unknown) {
      onError(e as Error);
    }
  }

  function onLoad() {
    renderWidget();
  }

  useEffect(() => {
    if (!widgetID.current && window.turnstile) {
      renderWidget();
    }
    return () => {
      if (window.turnstile && widgetID.current) {
        window.turnstile.remove(widgetID.current);
      }
      widgetID.current = undefined;
    };
  }, []);

  if (isError) {
    return (
      <div className="text-red-500 bg-white shadow-lg" onClick={retry}>
        Load captcha error
        <span className="text-blue-500 cursor-pointer inline-block text-sm font-semibold ml-2">
          Retry
        </span>
      </div>
    );
  }

  return (
    <>
      <div id="captcha-container"></div>
      <Script
        src={scriptLink}
        onLoad={onLoad}
        onError={(e) => onError("load error: " + e.message)}
      />
    </>
  );
}

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import React from "react";

interface ContactEmailTemplateProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  fullName,
  phoneNumber,
  email,
  message,
}) => {
  const previewText = `সাঈদ আপনার বার্তা পেয়েছে, ${fullName}!`; // Text for email preview

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-white rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Heading className="text-2xl font-semibold text-center text-gray-700">
              ধন্যবাদ, {fullName}!
            </Heading>

            <Section className="p-4">
              <Text className="text-gray-700 text-center mb-6">
                আমি আপনার বার্তা পেয়ে খুশি হলাম। আপনার দেয়া তথ্যের সারসংক্ষেপঃ
              </Text>

              {/* Message Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <ul className="text-gray-700">
                  <li>
                    <strong>নাম:</strong> {fullName}
                  </li>
                  <li>
                    <strong>ইমেইল:</strong> {email}
                  </li>
                  <li>
                    <strong>ফোন নাম্বার:</strong> {phoneNumber}
                  </li>
                  <li className="mt-2">
                    <strong>বার্তা:</strong>
                    <p className="italic">{message}</p>
                  </li>
                </ul>
              </div>

              <Text className="text-gray-700 text-center mb-6">
                আমি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো। আপনি এই ইমেইলে
                প্রতিত্তোর দিয়ে নতুন বার্তা পাঠাতে পারেন।
              </Text>

              {/* Best regards and image */}
              <div className="flex flex-col items-center">
                <Text className="text-gray-700 text-center mt-6"> ইতি, </Text>
                <div className="flex items-center">
                  <Img
                    src="https://sayed.page/dp.webp"
                    alt="SAYED"
                    className="rounded-full w-12 h-12 mr-2"
                  />
                </div>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

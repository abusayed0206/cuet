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
  const previewText = `Thank You, ${fullName}!`; // Text for email preview

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-white rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Heading className="text-2xl font-semibold text-center text-gray-700">
              Thank You, {fullName}!
            </Heading>

            <Section className="p-4">
              <Text className="text-gray-700 text-center mb-6">
                I appreciate you reaching out. Here's a summary of your message:
              </Text>

              {/* Message Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <ul className="text-gray-700">
                  <li>
                    <strong>Name:</strong> {fullName}
                  </li>
                  <li>
                    <strong>Email:</strong> {email}
                  </li>
                  <li>
                    <strong>Phone Number:</strong> {phoneNumber}
                  </li>
                  <li className="mt-2">
                    <strong>Message:</strong>
                    <p className="italic">{message}</p>
                  </li>
                </ul>
              </div>

              <Text className="text-gray-700 text-center mb-6">
                I'll get back to you as soon as possible. You're also welcome to
                reply directly to this email.
              </Text>

              {/* Best regards and image */}
              <div className="flex flex-col items-center">
                <Text className="text-gray-700 text-center mt-6">
                  {" "}
                  Best regards,{" "}
                </Text>
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

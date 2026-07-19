import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from '@react-email/components'

import { Tailwind } from '@react-email/tailwind'

export default function BookingConfirmed({ booking }) {
  const formattedTime =
    booking.appointment_time?.slice(0, 5)

  return (
    <Html>
      <Head />

      <Tailwind>
        <Body className="bg-slate-100 py-10 font-sans">

          <Container className="bg-white rounded-xl shadow-lg max-w-xl mx-auto">

            <Section className="bg-blue-900 p-8 rounded-t-xl text-center">

              <Heading className="text-white text-3xl m-0">
                E-Ambassade
              </Heading>

              <Text className="text-blue-100">
                Booking Confirmation
              </Text>

            </Section>

            <Section className="p-8">

              <Heading className="text-blue-900">
                Hello {booking.full_name},
              </Heading>

              <Text>
                Your booking has been successfully confirmed.
              </Text>

              <Hr />

              <Text>
                <strong>Service:</strong><br />
                {booking.service_type}
              </Text>

              <Text>
                <strong>Date:</strong><br />
                {booking.appointment_date}
              </Text>

              <Text>
                <strong>Time:</strong><br />
                {formattedTime}
              </Text>

              <Text>
                <strong>Reference:</strong><br />
                {booking.id}
              </Text>

              <Hr />

              <Text>
                Please arrive on time with all required documents.
              </Text>

              <Text>
                Kind regards,<br />
                <strong>E-Ambassade Team</strong>
              </Text>

            </Section>

          </Container>

        </Body>
      </Tailwind>

    </Html>
  )
}
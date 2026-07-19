import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components'

import { Tailwind } from '@react-email/tailwind'

export default function BookingCancelled({ booking }) {

  const formattedTime =
    booking.appointment_time?.slice(0, 5)

  return (
    <Html>
      <Head />

      <Tailwind>

        <Body className="bg-slate-100 py-10 font-sans">

          <Container className="bg-white rounded-xl shadow-lg max-w-xl mx-auto">

            <Section className="bg-red-700 p-8 rounded-t-xl text-center">

              <Heading className="text-white text-3xl m-0">
                E-Ambassade
              </Heading>

              <Text className="text-red-100">
                Booking Cancelled
              </Text>

            </Section>

            <Section className="p-8">

              <Heading className="text-red-700">
                Hello {booking.full_name},
              </Heading>

              <Text>
                Unfortunately, your booking has been cancelled.
              </Text>

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
                If you have any questions, please contact us.
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
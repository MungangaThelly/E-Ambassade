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

export default function BookingCompleted({ booking }) {

  return (
    <Html>

      <Head />

      <Tailwind>

        <Body className="bg-slate-100 py-10 font-sans">

          <Container className="bg-white rounded-xl shadow-lg max-w-xl mx-auto">

            <Section className="bg-green-700 p-8 rounded-t-xl text-center">

              <Heading className="text-white text-3xl m-0">
                E-Ambassade
              </Heading>

              <Text className="text-green-100">
                Appointment Completed
              </Text>

            </Section>

            <Section className="p-8">

              <Heading className="text-green-700">
                Hello {booking.full_name},
              </Heading>

              <Text>
                Your appointment has now been completed.
              </Text>

              <Text>
                Thank you for choosing E-Ambassade.
              </Text>

              <Text>
                We appreciate your trust and hope we were able to assist you successfully.
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
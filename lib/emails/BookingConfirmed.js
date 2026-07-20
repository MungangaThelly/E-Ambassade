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
                Bokningsbekräftelse
              </Text>

            </Section>

            <Section className="p-8">

              <Heading className="text-blue-900">
                Hej {booking.full_name},
              </Heading>

              <Text>
                Din bokning har bekräftats. Vi ser fram emot att träffa dig!
              </Text>

              <Hr />

              <Text>
                <strong>Tjänst:</strong><br />
                {booking.service_type}
              </Text>

              <Text>
                <strong>Datum:</strong><br />
                {booking.appointment_date}
              </Text>

              <Text>
                <strong>Tid:</strong><br />
                {formattedTime}
              </Text>

              <Text>
                <strong>Referensnummer:</strong><br />
                {booking.id}
              </Text>

              <Hr />

              <Text>
                Vänlig anmodning att ankomma i god tid med erforderliga handlingar.
              </Text>

              <Text>
                Med vänlig hälsning,<br />
                <strong>E-Ambassade</strong>
              </Text>

            </Section>

          </Container>

        </Body>
      </Tailwind>

    </Html>
  )
}
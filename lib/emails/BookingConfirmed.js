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
import { serverT } from '@/lib/i18n/server'

export default function BookingConfirmed({ booking, locale = 'fr' }) {
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
                {serverT(locale, 'email.confirmationHeading')}
              </Text>

            </Section>

            <Section className="p-8">

              <Heading className="text-blue-900">
                {serverT(locale, 'email.greeting', { name: booking.full_name })}
              </Heading>

              <Text>
                {serverT(locale, 'email.confirmationIntro')}
              </Text>

              <Hr />

              <Text>
                <strong>{serverT(locale, 'email.serviceType')}:</strong><br />
                {booking.service_type}
              </Text>

              <Text>
                <strong>{serverT(locale, 'email.date')}:</strong><br />
                {booking.appointment_date}
              </Text>

              <Text>
                <strong>{serverT(locale, 'email.time')}:</strong><br />
                {formattedTime}
              </Text>

              <Text>
                <strong>{serverT(locale, 'email.referenceNumber')}:</strong><br />
                {booking.id}
              </Text>

              <Hr />

              <Text>
                {serverT(locale, 'email.seeYouSoon')}
              </Text>

              <Text>
                {serverT(locale, 'email.regards')},<br />
                <strong>E-Ambassade</strong>
              </Text>

            </Section>

          </Container>

        </Body>
      </Tailwind>

    </Html>
  )
}
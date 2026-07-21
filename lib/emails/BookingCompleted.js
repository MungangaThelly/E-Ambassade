import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components'
import { serverT } from '@/lib/i18n/server'

export default function BookingCompleted({ booking, locale = 'fr' }) {

  return (
    <Html>

      <Head />

      <Body className="bg-slate-100 py-10 font-sans">

        <Container className="bg-white rounded-xl shadow-lg max-w-xl mx-auto">

          <Section className="bg-green-700 p-8 rounded-t-xl text-center">

            <Heading className="text-white text-3xl m-0">
              E-Ambassade
            </Heading>

            <Text className="text-green-100">
              {serverT(locale, 'email.statusCompletedTitle')}
            </Text>

          </Section>

          <Section className="p-8">

            <Heading className="text-green-700">
              {serverT(locale, 'email.greeting', { name: booking.full_name })}
            </Heading>

            <Text>
              {serverT(locale, 'email.statusCompletedMessage')}
            </Text>

            <Text>
              {serverT(locale, 'email.seeYouSoon')}
            </Text>

            <Text>
              {serverT(locale, 'email.confirmationIntro')}
            </Text>

            <Text>
              {serverT(locale, 'email.regards')},<br />
              <strong>E-Ambassade</strong>
            </Text>

          </Section>

        </Container>

      </Body>

    </Html>
  )
}
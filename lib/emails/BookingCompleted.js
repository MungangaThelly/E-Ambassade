import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components'

export default function BookingCompleted({ booking }) {

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
              Möte genomfört
            </Text>

          </Section>

          <Section className="p-8">

            <Heading className="text-green-700">
              Hej {booking.full_name},
            </Heading>

            <Text>
              Ditt möte har nu genomförts.
            </Text>

            <Text>
              Tack för att du valde E-Ambassade.
            </Text>

            <Text>
              Vi uppskattar ditt förtroende och hoppas att vi kunnat assistera dig på ett framgångsrikt sätt.
            </Text>

            <Text>
              Med vänlig hälsning,<br />
              <strong>E-Ambassade</strong>
            </Text>

          </Section>

        </Container>

      </Body>

    </Html>
  )
}
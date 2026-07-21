import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components'


export default function BookingCancelled({ booking }) {

  const formattedTime =
    booking.appointment_time?.slice(0, 5)


  return (

    <Html>

      <Head />


      <Body className="bg-slate-100 py-10 font-sans">


        <Container className="bg-white rounded-xl shadow-lg max-w-xl mx-auto">


          <Section className="bg-red-700 p-8 rounded-t-xl text-center">


            <Heading className="text-white text-3xl m-0">
              E-Ambassade
            </Heading>


            <Text className="text-red-100">
              Bokning avbokad
            </Text>


          </Section>



          <Section className="p-8">


            <Heading className="text-red-700">
              Hej {booking.full_name},
            </Heading>



            <Text>
              Tyvärr har din bokning avbokats.
            </Text>



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
              Om du har frågor, kontakta oss gärna.
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
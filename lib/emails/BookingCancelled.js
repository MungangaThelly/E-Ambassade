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


export default function BookingCancelled({ booking, locale = 'fr' }) {

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
              {serverT(locale, 'email.statusCancelledTitle')}
            </Text>


          </Section>



          <Section className="p-8">


            <Heading className="text-red-700">
              {serverT(locale, 'email.greeting', { name: booking.full_name })}
            </Heading>



            <Text>
              {serverT(locale, 'email.contactSupport')}
            </Text>



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
              {serverT(locale, 'email.statusCancelledMessage')}
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
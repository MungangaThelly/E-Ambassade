const result =
  await resend.emails.send({

    from:
      'E-Ambassade <noreply@e-ambassade.nuhar.se>',

    to:
      booking.email,

    subject,

    html: `
      <h1>E-Ambassade</h1>

      <p>Hej ${booking.full_name}</p>

      <p>
        Din bokningsstatus är:
        <strong>${status}</strong>
      </p>

      <p>
        Tjänst: ${booking.service_type}<br/>
        Datum: ${booking.appointment_date}<br/>
        Tid: ${booking.appointment_time}
      </p>

      <p>
        Med vänlig hälsning,<br/>
        E-Ambassade
      </p>
    `

})
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/translations'

const serverTranslations = {
  fr: {
    api: {
      notAuthenticated: 'Non authentifie',
      unauthorized: 'Non autorise',
      statusRequired: 'Le statut est obligatoire',
      notificationIdRequired: 'L\'identifiant de notification est obligatoire',
      emailConfirmRequired: 'Veuillez confirmer votre adresse e-mail avant de faire une reservation. Verifiez votre e-mail pour le lien de confirmation.',
      bookingStatusUpdated: 'Statut de reservation mis a jour',
      bookingCreatedTitle: 'Nouvelle reservation creee',
      bookingCreatedMessage: 'Votre reservation a ete envoyee et attend l\'approbation.',
      bookingConfirmed: 'Votre reservation a ete confirmee.',
      bookingCancelled: 'Votre reservation a ete annulee.',
      bookingCompleted: 'Votre reservation est marquee comme terminee.',
      internalError: 'Une erreur interne est survenue',
    },
    email: {
      confirmationSubject: 'Confirmation de reservation - E-Ambassade',
      confirmationHeading: 'Confirmation de reservation',
      greeting: 'Bonjour {name},',
      confirmationIntro: 'Votre reservation a ete enregistree avec succes.',
      detailsTitle: 'Details de reservation:',
      referenceNumber: 'Numero de reference',
      serviceType: 'Type de service',
      date: 'Date',
      time: 'Heure',
      email: 'E-mail',
      phone: 'Telephone',
      status: 'Statut',
      seeYouSoon: 'A bientot!',
      regards: 'Cordialement',
      statusConfirmedSubject: 'Reservation confirmee - E-Ambassade',
      statusConfirmedTitle: 'Votre reservation est confirmee !',
      statusConfirmedMessage: 'Nous avons hate de vous recevoir au rendez-vous prevu.',
      statusCompletedSubject: 'Reservation terminee - E-Ambassade',
      statusCompletedTitle: 'Merci pour votre visite !',
      statusCompletedMessage: 'Merci de nous avoir fait confiance. N\'hesitez pas a nous recontacter.',
      statusCancelledSubject: 'Reservation annulee - E-Ambassade',
      statusCancelledTitle: 'Votre reservation a ete annulee',
      statusCancelledMessage: 'Votre reservation precedente est maintenant annulee. Contactez-nous pour reserver un nouveau rendez-vous.',
      contactSupport: 'Pour toute question, merci de nous contacter.',
      statusText: {
        pending: 'En attente',
        confirmed: 'Confirmee',
        completed: 'Terminee',
        cancelled: 'Annulee',
      },
    },
  },
  sv: {
    api: {
      notAuthenticated: 'Inte autentiserad',
      unauthorized: 'Obehorig',
      statusRequired: 'Status kravs',
      notificationIdRequired: 'Notifikations-ID kravs',
      emailConfirmRequired: 'Vanligen bekrafta din e-postadress innan du gor en bokning. Kontrollera din e-post for en bekraftelselank.',
      bookingStatusUpdated: 'Bokningsstatus uppdaterad',
      bookingCreatedTitle: 'Ny bokning skapad',
      bookingCreatedMessage: 'Din bokning har skickats och vantar pa godkannande.',
      bookingConfirmed: 'Din bokning har blivit bekraftad.',
      bookingCancelled: 'Din bokning har blivit avbokad.',
      bookingCompleted: 'Din bokning ar markerad som genomford.',
      internalError: 'Ett internt fel uppstod',
    },
    email: {
      confirmationSubject: 'Bokningsbekraftelse - E-Ambassade',
      confirmationHeading: 'Bokningsbekraftelse',
      greeting: 'Hej {name},',
      confirmationIntro: 'Din bokning har registrerats.',
      detailsTitle: 'Bokningsdetaljer:',
      referenceNumber: 'Referensnummer',
      serviceType: 'Tjanstetyp',
      date: 'Datum',
      time: 'Tid',
      email: 'E-post',
      phone: 'Telefon',
      status: 'Status',
      seeYouSoon: 'Vi ses snart!',
      regards: 'Vanliga halsningar',
      statusConfirmedSubject: 'Bokning bekraftad - E-Ambassade',
      statusConfirmedTitle: 'Din bokning ar bekraftad!',
      statusConfirmedMessage: 'Vi ser fram emot att traffa dig pa det planerade tillfallet.',
      statusCompletedSubject: 'Bokning genomford - E-Ambassade',
      statusCompletedTitle: 'Tack for besoket!',
      statusCompletedMessage: 'Vi hoppas att vi kunde hjalpa dig. Kontakta oss garna igen.',
      statusCancelledSubject: 'Bokning avbokad - E-Ambassade',
      statusCancelledTitle: 'Din bokning har avbokats',
      statusCancelledMessage: 'Din tidigare bokning ar nu avbokad. Kontakta oss om du vill boka ett nytt tillfalle.',
      contactSupport: 'Om du har fragor, kontakta oss garna.',
      statusText: {
        pending: 'Vantande',
        confirmed: 'Bekraftad',
        completed: 'Genomford',
        cancelled: 'Avbokad',
      },
    },
  },
  en: {
    api: {
      notAuthenticated: 'Not authenticated',
      unauthorized: 'Unauthorized',
      statusRequired: 'Status is required',
      notificationIdRequired: 'Notification ID is required',
      emailConfirmRequired: 'Please confirm your email address before creating a booking. Check your email for a confirmation link.',
      bookingStatusUpdated: 'Booking status updated',
      bookingCreatedTitle: 'New booking created',
      bookingCreatedMessage: 'Your booking was submitted and is waiting for approval.',
      bookingConfirmed: 'Your booking has been confirmed.',
      bookingCancelled: 'Your booking has been cancelled.',
      bookingCompleted: 'Your booking is marked as completed.',
      internalError: 'An internal error occurred',
    },
    email: {
      confirmationSubject: 'Booking confirmation - E-Ambassade',
      confirmationHeading: 'Booking confirmation',
      greeting: 'Hello {name},',
      confirmationIntro: 'Your booking was submitted successfully.',
      detailsTitle: 'Booking details:',
      referenceNumber: 'Reference number',
      serviceType: 'Service type',
      date: 'Date',
      time: 'Time',
      email: 'Email',
      phone: 'Phone',
      status: 'Status',
      seeYouSoon: 'See you soon!',
      regards: 'Best regards',
      statusConfirmedSubject: 'Booking confirmed - E-Ambassade',
      statusConfirmedTitle: 'Your booking is confirmed!',
      statusConfirmedMessage: 'We look forward to meeting you at your appointment.',
      statusCompletedSubject: 'Booking completed - E-Ambassade',
      statusCompletedTitle: 'Thank you for your visit!',
      statusCompletedMessage: 'Thank you for your trust. Feel free to contact us again.',
      statusCancelledSubject: 'Booking cancelled - E-Ambassade',
      statusCancelledTitle: 'Your booking has been cancelled',
      statusCancelledMessage: 'Your previous booking is now cancelled. Contact us if you want to schedule a new appointment.',
      contactSupport: 'If you have questions, please contact us.',
      statusText: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
  },
}

function resolveLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
}

function getValue(obj, key) {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

export function getRequestLocale(request) {
  const headerLocale = request?.headers?.get('x-locale')?.slice(0, 2)?.toLowerCase()
  if (SUPPORTED_LOCALES.includes(headerLocale)) {
    return headerLocale
  }

  const acceptLanguage = request?.headers?.get('accept-language') || ''
  const accepted = acceptLanguage.split(',').map((item) => item.trim().slice(0, 2).toLowerCase())
  const matched = accepted.find((item) => SUPPORTED_LOCALES.includes(item))

  return resolveLocale(matched)
}

export function serverT(locale, key, vars = {}) {
  const resolvedLocale = resolveLocale(locale)
  const localized = getValue(serverTranslations[resolvedLocale], key)
  const fallback = getValue(serverTranslations.en, key)
  const value = localized ?? fallback ?? key

  if (typeof value !== 'string') {
    return value
  }

  return value.replace(/\{(\w+)\}/g, (_, token) => {
    return vars[token] !== undefined ? String(vars[token]) : `{${token}}`
  })
}

export function getStatusText(locale, status) {
  return serverT(locale, `email.statusText.${status}`)
}

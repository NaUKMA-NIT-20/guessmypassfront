export const Patterns = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  email: /\b[\w\\.-]+@[\w\\.-]+\.\w{2,4}\b/,
  cardMask: '#### #### #### ####',
  cvvMask: '###',
  cardRegex: '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$',
  urlRegex: '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$'
}

export const Bounds = {
  passwordBounds: {
    min: 8,
    max: 120
  },
  usernameBounds: {
    min: 3,
    max: 60
  },
  passwordHelpBounds: {
    min: 3,
    max: 120
  },
  nameMaxBound: 20,
  cardholderBound: 40
}

export const CardsValidation = {
  validateUrl (url) {
    if (url &&
      !RegExp(Patterns.urlRegex).test(url)) return 'Посилання не дійсне'
    else return true
  },
  validateUsername (username) {
    if (username === '') {
      return true
    } else if (username.length < Bounds.usernameBounds.min) {
      return 'Назва занадто коротка'
    } else if (username.length > Bounds.usernameBounds.max) {
      return 'Назва занадто довга'
    } else {
      return true
    }
  },
  validateCard (card) {
    const lengthMsg = 'Довжина номера картки складається з 16 цифр'
    const invalid = 'Номер картки не дійсний'
    if (card) {
      const unspacedCard = card.replace(/\s/g, '')
      if (unspacedCard.length !== 16) return lengthMsg
      else if (!RegExp(Patterns.cardRegex).test(unspacedCard)) return invalid
      else return true
    } else return 'Введіть кредитну картку'
  },
  validateCvv (cvv) {
    if (cvv && cvv.length !== 3) return 'CVV складається з 3 цифр'
    else return true
  }
}

export const AuthorisationValidation = {
  validatePasswordHelp (passwordHelp) {
    if (passwordHelp === '') {
      return true
    } else if (passwordHelp.length < Bounds.passwordHelpBounds.min) {
      return 'Підказка занадто коротка'
    } else if (passwordHelp.length > Bounds.passwordHelpBounds.max) {
      return 'Підказка занадто довга'
    } else {
      return true
    }
  },
  validateMatchingPasswords (passwordFunction) {
    return passwordFunction ? true : 'Пароль не співпадає'
  },
  validateUsername (username) {
    if (username === '') {
      return true
    } else if (username.length < Bounds.usernameBounds.min) {
      return 'Нікнейм занадто короткий'
    } else if (username.length > Bounds.usernameBounds.max) {
      return 'Нікнейм занадто довгий'
    } else {
      return true
    }
  },
  validatePassword (password) {
    const msg = 'Мін. 8 символів і хоча б одна заголовна буква, число'
    return password !== '' ? (Patterns.password.test(password) || msg) : true
  },
  validateEmail (email) {
    if (email === '') {
      return true
    } else if (!Patterns.email.test(email)) {
      return 'Неправильна пошта'
    } else {
      return true
    }
  },
  getEmailInstructions (email, validatorMessage) {
    let instruction = {
      invalid: false,
      message: ''
    }
    if (validatorMessage !== true || email === '') {
      instruction.message = validatorMessage
      if (email === '') {
        instruction.message = 'Введіть пошту'
      }
      instruction.invalid = true
    }
    return instruction
  },
  getPasswordInstructions (password, validatorMessage) {
    let instruction = {
      invalid: false,
      message: ''
    }
    if (validatorMessage !== true || password === '') {
      instruction.message = validatorMessage
      if (password === '') {
        instruction.message = 'Введіть пароль'
      }
      instruction.invalid = true
    }
    return instruction
  },
  getUsernameInstructions (username, validatorMessage) {
    let instruction = {
      invalid: false,
      message: ''
    }
    if (validatorMessage !== true || username === '') {
      instruction.message = validatorMessage
      if (username === '') {
        instruction.message = 'Нік не може бути порожній'
      }
      instruction.invalid = true
    }
    return instruction
  },
  getMatchPasswordInstructions (validatorMessage) {
    let instruction = {
      invalid: false,
      message: ''
    }
    if (validatorMessage !== true) {
      instruction.invalid = true
      instruction.message = validatorMessage
    }
    return instruction
  },
  getPasswordHelpInstructions (validatorMessage) {
    let instruction = {
      invalid: false,
      message: ''
    }
    if (validatorMessage !== true) {
      instruction.invalid = true
      instruction.message = validatorMessage
    }
    return instruction
  }
}

export const helperFunction = {
  checkLoginError (error) {
    console.log(error.status)
    switch (error.status) {
      case 400:
        return 'Неправильний логін або пароль:/'
      case 404:
        return 'Користувача не знайдено:/'
      case 500:
        return 'Помилка сервера. Спробуйте пізніше:/'
      default:
        return 'Незнайома помилка ¯\\_(ツ)_/¯'
    }
  },
  checkRegisterError (error) {
    switch (error.status) {
      case 400:
        return 'Такий користувач вже існує :/'
      case 404:
        return 'Користувача створено, проте трапилась помилка при логіні. Спробуйте увійти трохи пізніше :/'
      case 500:
        return 'Помилка сервера. Спробуйте пізніше:/'
      default:
        return 'Незнайома помилка ¯\\_(ツ)_/¯'
    }
  }
}

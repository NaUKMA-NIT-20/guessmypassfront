export const Patterns = {
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  email: /\b[\w\\.-]+@[\w\\.-]+\.\w{2,4}\b/
}

export const Bounds = {
  passwordBounds: {
    min: 8,
    max: 120
  },
  usernameBounds: {
    min: 3,
    max: 14
  },
  passwordHelpBounds: {
    min: 3,
    max: 120
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

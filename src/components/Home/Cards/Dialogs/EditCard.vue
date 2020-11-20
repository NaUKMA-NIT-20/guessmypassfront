<template>
  <v-row justify="center">
    <v-dialog
      v-model="cardState"
      max-width="800px"
      transition="scroll-y-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Редагувати картку</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              :loading="isLoading"
              @click="saveEditedCard"
            >
              Зберегти зміни
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-snackbar
          v-model="invalid">
          {{ invalidText }}
          <template v-slot:action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="invalid = false">
              Закрити
            </v-btn>
          </template>
        </v-snackbar>

        <v-list
          three-line
        >
          <v-list-item v-if="cardType !== 'Нотатка'">
            <v-list-item-content>
              <v-list-item-title>Базові дані</v-list-item-title>
              <v-list-item-subtitle>Редагуйте вашу картку.</v-list-item-subtitle>
              <v-list-item-subtitle v-if="cardType === 'Пароль'">Обов`язково введіть <b>назву</b> та <b>пароль</b>.</v-list-item-subtitle>
              <v-list-item-subtitle v-else-if="cardType === 'Кредитна картка'">Обов`язково введіть <b>назву</b> та <b>номер кредитної картки</b>.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>Ваша нотатка.</v-list-item-title>
              <v-list-item-subtitle>Обов`язково введіть <b>назву</b>.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-form v-if="cardType === 'Пароль'" ref="form_req">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[validateName]"
                    v-model="data.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="URL"
                    placeholder="ex. https://google.com"
                    :rules="[validateUrl]"
                    v-model="data.url"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Пароль до сайту"
                    placeholder="тут пароль"
                    :rules="[validatePassword]"
                    v-model="data.password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>
          <v-form v-else-if="cardType === 'Кредитна картка'" ref="form_req">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[validateName]"
                    v-model="data.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="ПІБ власника картки"
                    placeholder="напиши тут шось"
                    :rules="[validateCardholder]"
                    v-model="data.cardholder"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Номер картки"
                    placeholder="0000 0000 0000 0000"
                    v-model="data.card"
                    :rules="[validateCard]"
                    v-mask="cardMask"
                    required
                  ></v-text-field>
                </v-col>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="CVV"
                    placeholder="000"
                    v-model="data.cvv"
                    :rules="[validateCVV]"
                    v-mask="cvvMask"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>

          <v-form v-else-if="cardType === 'Нотатка'" ref="form_req">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[validateName]"
                    v-model="data.name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>

          <v-divider v-if="cardType !== 'Нотатка'"></v-divider>
          <v-list-item v-if="cardType !== 'Нотатка'">
            <v-list-item-content>
              <v-list-item-title>Додаткові дані</v-list-item-title>
              <v-list-item-subtitle>Редагуйте додаткові дані вашої картки.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-form ref="form">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-textarea
                    counter
                    v-model="data.notes"
                    placeholder="напиши щось"
                    label="Нотатки"
                  ></v-textarea>

                </v-col></v-row>
            </v-list-item>
          </v-form>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data () {
    return {
      data: {
        card: '',
        cvv: '',
        name: '',
        url: '',
        notes: '',
        cardholder: '',
        password: ''
      },
      mobile: 12,
      flex: 12,
      cols: 12,
      cardType: '',
      cardToEdit: null,
      isLoading: false,
      invalidText: '',
      nameMaxBound: 20,
      cardholderBound: 40,
      cardMask: '#### #### #### ####',
      cvvMask: '###',
      cardRegex: '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$',
      urlRegex:
        '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$',
      invalid: false
    }
  },
  computed: {
    cardState () {
      return this.state
    }
  },
  props: {
    state: Boolean
  },
  methods: {
    closeDialog () {
      this.$refs.form.reset()
      this.$refs.form_req.reset()
      this.$emit('close')
    },
    validateName () {
      if (this.data.name) {
        if (this.data.name.length > this.nameMaxBound) return 'Назва має містити не більше ' + this.nameMaxBound + ' символів'
        else return true
      } else return 'Введіть назву'
    },
    validateUrl () {
      if (this.data.url &&
        !RegExp(this.urlRegex).test(this.data.url)) return 'Посилання не дійсне'
      else return true
    },
    validateCard () {
      const lengthMsg = 'Довжина номера картки складається з 16 цифр'
      const invalid = 'Номер картки не дійсний'
      if (this.data.card) {
        const unspacedCard = this.data.card.replace(/\s/g, '')
        if (unspacedCard.length !== 16) return lengthMsg
        else if (!RegExp(this.cardRegex).test(unspacedCard)) return invalid
        else return true
      } else return true
    },
    validatePassword () {
      if (this.data.password) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
        const msg = 'Мін. 8 символів і хоча б одна заголовна буква, число'
        return (pattern.test(this.data.password) || msg)
      } else return 'Введіть пароль'
    },
    validateCVV () {
      if (this.data.cvv && this.data.cvv.length !== 3) return 'CVV складається з 3 цифр'
      else return true
    },
    validateCardholder () {
      if (this.data.cardholder &&
        this.data.cardholder.length > this.cardholderBound) return 'ПІБ має містити не більше ' + this.cardholderBound + ' символів'
      else return true
    },
    validatePasswordCardInput () {
      const nameValid = this.validateName()
      const urlValid = this.validateUrl()
      const passwordValid = this.validatePassword()

      if (nameValid !== true) {
        this.invalid = true
        this.invalidText = nameValid
        return false
      } else if (urlValid !== true) {
        this.invalid = true
        this.invalidText = urlValid
        return false
      } else if (passwordValid !== true) {
        this.invalid = true
        this.invalidText = passwordValid
        return false
      }

      return true
    },
    validateCreditInput () {
      const nameValid = this.validateName()
      const cardNumberValid = this.validateCard()
      const cardholderValid = this.validateCardholder()
      const cvvValid = this.validateCVV()

      if (nameValid !== true) {
        this.invalid = true
        this.invalidText = nameValid
        return false
      } else if (cardNumberValid !== true) {
        this.invalid = true
        this.invalidText = cardNumberValid
        return false
      } else if (cardholderValid !== true) {
        this.invalid = true
        this.invalidText = cardholderValid
        return false
      } else if (cvvValid !== true) {
        this.invalid = true
        this.invalidText = cvvValid
        return false
      }

      return true
    },
    validateNoteInput () {
      const nameValid = this.validateName()

      if (nameValid !== true) {
        this.invalid = true
        this.invalidText = nameValid
        return false
      }

      return true
    },
    startEditingCard (cardToEdit) {
      this.cardToEdit = cardToEdit
      this.data.card = cardToEdit.number
      this.data.name = cardToEdit.name
      this.data.url = cardToEdit.url
      this.data.cardholder = cardToEdit.cardholderName
      this.data.cvv = cardToEdit.cvv
      this.data.notes = cardToEdit.notes
      this.data.password = cardToEdit.password

      if (this.data.password !== '') {
        this.cardType = 'Пароль'
      } else if (this.data.card !== '') {
        this.cardType = 'Кредитна картка'
      } else this.cardType = 'Нотатка'

      console.log(this.cardToEdit)
    },
    async saveEditedCard () {
      if (this.cardToEdit === null || this.cardToEdit === undefined) this.closeDialog()
      let validation = false
      switch (this.cardType) {
        case 'Пароль':
          validation = this.validatePasswordCardInput()
          break
        case 'Кредитна картка':
          validation = this.validateCreditInput()
          break
        case 'Нотатка':
          validation = this.validateNoteInput()
      }
      if (validation) {
        const res = await this.$confirm('Ви дійсно хочете зберегти зміни ?', {
          title: 'Підтвердження',
          color: 'blue',
          icon: 'mdi-wrench'
        })
        if (res) {
          this.isLoading = true
          this.$store.dispatch('cards/updateCard', {
            id: this.cardToEdit.id,
            name: this.data.name,
            url: this.data.url,
            notes: this.data.notes,
            cardholderName: this.data.cardholder,
            number: this.data.card.replace(/\s/g, ''),
            cvv: this.data.cvv,
            password: this.data.password
          }).then((card) => {
            this.isLoading = false
            this.$emit('onSave')
            this.closeDialog()
          }).catch((error) => {
            this.isLoading = false
            this.invalid = true
            this.invalidText = error
          })
        }
      }
    }
  }
}
</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="cardState"
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

        <v-subheader>Редагуйте картку.</v-subheader>
        <v-list
          three-line
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Базові дані</v-list-item-title>
              <v-list-item-subtitle>Редагуйте базові дані вашої картки.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-form ref="form_req">
            <v-list-item>
              <v-row>
                <v-col cols="12"
                       sm="6"
                       md="3">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[validateName]"
                    v-model="data.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12"
                       sm="6"
                       md="3">
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
                <v-col cols="12"
                       sm="6"
                       md="3">
                  <v-text-field
                    label="Номер картки"
                    placeholder="0000 0000 0000 0000"
                    v-model="data.card"
                    :rules="[validateCard]"
                    v-mask="cardMask"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12"
                       sm="6"
                       md="3">
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
            <v-list-item>
              <v-row>
                <v-col cols="12"
                       sm="6"
                       md="3">
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
          </v-form>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Додаткові дані</v-list-item-title>
              <v-list-item-subtitle>Редагуйте додаткові дані вашої картки.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-form ref="form">
            <v-list-item>
              <v-row>
                <v-col cols="12"
                       sm="6"
                       md="3">
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
        cardholder: ''
      },
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
    validateCVV () {
      if (this.data.cvv && this.data.cvv.length !== 3) return 'CVV складається з 3 цифр'
      else return true
    },
    validateCardholder () {
      if (this.data.cardholder &&
        this.data.cardholder.length > this.cardholderBound) return 'ПІБ має містити не більше ' + this.cardholderBound + ' символів'
      else return true
    },
    validateCardInput () {
      const nameValid = this.validateName()
      const cardNumberValid = this.validateCard()
      const urlValid = this.validateUrl()
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
      } else if (urlValid !== true) {
        this.invalid = true
        this.invalidText = urlValid
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
    startEditingCard (cardToEdit) {
      this.cardToEdit = cardToEdit
      this.data.card = cardToEdit.number
      this.data.name = cardToEdit.name
      this.data.url = cardToEdit.url
      this.data.cardholder = cardToEdit.cardholderName
      this.data.cvv = cardToEdit.cvv
      this.data.notes = cardToEdit.notes
      console.log(this.cardToEdit)
    },
    async saveEditedCard () {
      if (this.cardToEdit === null || this.cardToEdit === undefined) this.closeDialog()
      const validation = this.validateCardInput()
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
            cvv: this.data.cvv
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

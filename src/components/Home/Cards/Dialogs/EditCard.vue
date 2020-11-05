<template>
  <v-row justify="center">
    <v-dialog
      v-model="state"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
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
              @click="saveEditedCard"
            >
              Зберегти зміни
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-subheader>Введіть дані вашої картки</v-subheader>
        <v-list
          three-line
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Базові дані</v-list-item-title>
              <v-list-item-subtitle>Введіть базові дані вашої картки.</v-list-item-subtitle>
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
              <v-list-item-subtitle>Введіть додаткові дані вашої картки.</v-list-item-subtitle>
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
                  card: '', // this.props.cardToEdit,
                  cvv: '',
                  name: '',
                  url: '',
                  notes: '',
                  cardholder: ''
              },
              cardToEdit: null,
              nameMaxBound: 20,
              cardMask: '#### #### #### ####',
              cvvMask: '###',
              cardRegex: '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$',
              urlRegex:
                  '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$',
              valid: true
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
          validateName (name) {
              if (this.data.name) {
                  if (this.data.name.length > this.nameMaxBound) return 'Назва має містити не більше ' + this.nameMaxBound + ' символів'
                  else return true
              } else return true
          },
          validateUrl (url) {
                  if (!new RegExp(this.urlRegex).test(this.data.url)) return 'Посилання не дійсне'
                  else return true
          },
          validateCard (card) {
              const length = 'Довжина номера картки складається з 16 цифр'
              const valid = 'Номер картки не дійсний'
              if (this.data.card) {
                  const unspacedCard = this.data.card.replace(/\s/g, '')
                  if (unspacedCard.length !== 16) return length
                  else if (!new RegExp(this.cardRegex).test(unspacedCard)) return valid
                  else return true
              } else return true
          },
          validateCVV (cvv) {
              const length = 'CVV складається з 3 цифр'
              if (this.data.cvv) {
                  if (this.data.cvv.length !== 3) return length
                  else return true
              }
              else return true
          },
          validateCardholder (name) {
              if ((this.data.cardholder)) {
                  if (this.data.cardholder.length > this.nameMaxBound) return 'Назва має містити не більше ' + this.nameMaxBound + ' символів'
                  else return true
              } else return true
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
          saveEditedCard () {
              const name = this.data.name
              const card = this.data.card
              const url = this.data.url
              const cardholder = this.data.cardholder
              const cvv = this.data.cvv
              if (this.validateName(name) &&
                  this.validateCard(card) &&
                  this.validateUrl(url) &&
                  this.validateCardholder(cardholder) &&
                  this.validateCVV(cvv)) {
                  this.$store.dispatch('cards/updateCard', {
                      id: this.cardToEdit.id,
                      name: name,
                      url: url,
                      notes: this.data.notes,
                      cardholderName: cardholder,
                      number: card.replace(/\s/g, ''),
                      cvv: cvv
                  }).then((card) => {
                      this.$emit('onSave')
                      this.closeDialog()
                  }).catch((error) => {
                      console.log(error)
                  })
              }
              else {
                  this.valid = false
              }
          }
      }
  }
</script>

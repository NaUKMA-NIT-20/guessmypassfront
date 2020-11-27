<template>
  <v-row justify="center">
    <v-dialog
      v-model="cardState"
      fullscreen
      hide-overlay
      :no-click-animation="true"
      :persistent="true"
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
          <v-toolbar-title>Додати картку</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              :loading="isLoading"
              @click="saveCard"
            >
              Зберегти
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

        <v-container fluid>
          <v-row align="center">
            <v-col
              :cols="cols"
              :sm="mobile"
              :md="flex"
            >
              <v-select
                v-model="cardTypeSelected"
                :items="cardTypes"
                menu-props="auto"
                label="Select"
                hide-details
                v-on:change="changeCardType"
                :prepend-icon="cardTypeIcon"
                single-line
              ></v-select>
            </v-col>
          </v-row>
        </v-container>

        <v-subheader>Оберіть тип картки, яку бажаєте створити(<b>пароль</b>, <b>кредитка</b>, <b>нотатка</b>)
        </v-subheader>
        <v-divider></v-divider>
        <v-list
          three-line
        >
          <v-list-item v-if="cardTypeSelected !== 'Нотатка'">
            <v-list-item-content>
              <v-list-item-title>Базові дані</v-list-item-title>
              <v-list-item-subtitle v-if="cardTypeSelected === 'Пароль'">Обов`язково введіть <b>назву</b> та <b>пароль</b>.</v-list-item-subtitle>
              <v-list-item-subtitle v-else-if="cardTypeSelected === 'Кредитна картка'">Обов`язково введіть <b>назву</b> та <b>номер кредитної картки</b>.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>Ваша нотатка.</v-list-item-title>
              <v-list-item-subtitle>Обов`язково введіть <b>назву</b>.</v-list-item-subtitle>
              </v-list-item-content>
          </v-list-item>

          <v-form v-if="cardTypeSelected === 'Пароль'" ref="form_req">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[library.Validation.validateUsername]"
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
                    :rules="[library.Validation.validateUrl]"
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
                    :rules="[library.Validation.validatePassword]"
                    v-model="data.password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>

          <v-form v-else-if="cardTypeSelected === 'Кредитна картка'" ref="form_req">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[library.Validation.validateUsername]"
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
                    :rules="[library.Validation.validateUsername]"
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
                    :rules="[library.Validation.validateCard]"
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
                    :rules="[library.Validation.validateCvv]"
                    v-mask="cvvMask"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>

          <v-form v-else-if="cardTypeSelected === 'Нотатка'" ref="form_req">
            <v-list-item>
              <v-row>
                <v-col :cols="cols"
                       :sm="mobile"
                       :md="flex">
                  <v-text-field
                    label="Назва"
                    placeholder="напиши тут шось"
                    :rules="[library.Validation.validateUsername]"
                    v-model="data.name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>

          <v-divider v-if="cardTypeSelected !== 'Нотатка'"></v-divider>
          <v-list-item v-if="cardTypeSelected !== 'Нотатка'">
            <v-list-item-content>
              <v-list-item-title>Додаткові дані</v-list-item-title>
              <v-list-item-subtitle>Введіть додаткові дані вашої картки.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-form ref="form_notes">
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
  import { Patterns, Bounds, CardsValidation, AuthorisationValidation } from '../../../../assets/js/Validation'
  import { encryptingFunctions } from '../../../../assets/js/Cryptor'

  export default {
      data () {
          return {
              library: {
                Patterns, Bounds, Validation: { ...AuthorisationValidation, ...CardsValidation }
              },
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
              flex: 4,
              cols: 12,
              cardTypeSelected: 'Пароль',
              cardTypes: ['Пароль', 'Кредитна картка', 'Нотатка'],
              isLoading: false,
              invalidText: '',
              invalid: false,
              ...Patterns
          }
      },
      computed: {
          cardState () {
              return this.state
          },
          cardTypeIcon () {
            switch
              (this.cardTypeSelected)
            {
              case 'Пароль': return 'mdi-lock'
              case 'Кредитна картка': return 'mdi-credit-card'
              case 'Нотатка': return 'mdi-file'
              default : return 'mdi-card'
            }
          }
      },
      props: {
          state: Boolean
      },
      methods: {
          closeDialog () {
              this.changeCardType()
              this.$emit('close')
              setTimeout(() => {
                  this.$refs.form_req.reset()
                  this.$refs.form_notes.reset()
              }, 500)
          },
          validatePasswordCardInput () {
            const nameValid = this.library.Validation.validateUsername(this.data.name)
            const urlValid = this.library.Validation.validateUrl(this.data.url)
            const passwordValid = this.library.Validation.validatePassword(this.data.password)

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
            const nameValid = this.library.Validation.validateUsername(this.data.name)
            const cardNumberValid = this.library.Validation.validateCard(this.data.card)
            const cardholderValid = this.library.Validation.validateUsername(this.data.cardholder)
            const cvvValid = this.library.Validation.validateCvv(this.data.cvv)

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
            const nameValid = this.library.Validation.validateUsername(this.data.name)

            if (nameValid !== true) {
              this.invalid = true
              this.invalidText = nameValid
              return false
            }

            return true
          },
          changeCardType () {
            this.data.card = ''
            this.data.cvv = ''
            this.data.cardholder = ''
            this.data.url = ''
            this.data.password = ''
          },
          saveCard () {
              this.isLoading = true
              let validation = false
              switch (this.cardTypeSelected) {
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
                  let data = {
                      name: this.data.name,
                      url: this.data.url,
                      notes: this.data.notes,
                      cardholderName: this.data.cardholder,
                      number: this.data.card === undefined ? undefined : this.data.card.replace(/\s/g, ''),
                      cvv: this.data.cvv,
                      password: this.data.password
                  }
                  Object.keys(data).map(function (key, index) {
                      if (key !== 'id') {
                          data[key] = encryptingFunctions.encrypt(data[key])
                      }
                  })
                  this.$store.dispatch('cards/addCard', data).then((card) => {
                      this.isLoading = false
                      this.$emit('onSave')
                      this.closeDialog()
                  }).catch((error) => {
                      this.isLoading = false
                      this.invalid = true
                      this.invalidText = error
                  })
              } else this.isLoading = false
          }
      }
  }
</script>

import { AlertBar } from 'components/atoms/AlertBar'
import { FormNeedsLogin } from 'components/atoms/FormNeedsLogin'
import { Loading } from 'components/atoms/Loading'
import TicketBox from 'components/molecules/TicketBox'
import ConferenceTicketOption from 'components/molecules/TicketBox/ConferenceTicketOption'
import TermsAgreement from 'components/molecules/TicketBox/TermsAgreement'
import TicketDescription from 'components/molecules/TicketBox/TicketDescription'
import i18next from 'i18next'
import { TicketTypeNode } from 'lib/apollo_graphql/__generated__/globalTypes'
import { TicketNode } from 'lib/apollo_graphql/queries/getMyTickets'
import { TICKET_STEP, TicketStep, VALIDATION_ERROR_TYPE } from 'lib/stores/Ticket/TicketStep'
import _ from 'lodash'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { RouterProps } from 'next/router'
import { StoresType } from 'pages/_app'
import * as React from 'react'
import { toast } from 'react-toastify'
import { paths } from 'routes/paths'
import { TICKET_COLOR } from 'styles/colors'

type PropsType = {
  stores: StoresType;
  t: i18next.TFunction;
  router: RouterProps;
}

type StatesType = {
  myConferenceTicket: TicketNode;
}
@observer
class ConferenceTicketList extends React.Component<PropsType, StatesType> {
  state = {
    myConferenceTicket: null as any
  }

  componentWillUnmount () {
    const { stores } = this.props
    const { clearTicketSteps } = stores.ticketStore
    clearTicketSteps()
  }

  getStepAction = (ticketStep: TicketStep) => {
    switch (ticketStep.ticketStepState) {
      case TICKET_STEP.BUYING:
        return null
      case TICKET_STEP.AGREE_TERMS:
        return () => this.onAgreeTerms(ticketStep)
      case TICKET_STEP.SELECT_OPTION:
        return () => this.onPayTicket(ticketStep)
      default:
        return null
    }
  }

  getNextTicketStep = (ticketStepState: TICKET_STEP) => {
    switch (ticketStepState) {
      case TICKET_STEP.BUYING:
        return TICKET_STEP.AGREE_TERMS
      case TICKET_STEP.AGREE_TERMS:
        return TICKET_STEP.SELECT_OPTION
      case TICKET_STEP.SELECT_OPTION:
        return TICKET_STEP.PAYING
      default:
        return TICKET_STEP.BUYING
    }
  }

  getTicketButtonTitle = (ticketStepState: TICKET_STEP) => {
    const { t } = this.props

    switch (ticketStepState) {
      case TICKET_STEP.BUYING:
        return t('ticket:buying')
      case TICKET_STEP.AGREE_TERMS:
        return t('ticket:agree')
      case TICKET_STEP.SELECT_OPTION:
        return t('ticket:paying')
      default:
        return t('ticket:buying')
    }
  }

  onAgreeTerms = (ticketStep: TicketStep) => {
    const { t } = this.props
    if (!ticketStep.isTermsAgreed) {
      toast.error(t('ticket:error.notAgreeToTerms'))

      return false
    }

    return true
  }

  onPayTicket = (ticketStep: TicketStep) => {
    const { stores, router, t } = this.props
    const { setPayingTicket } = stores.ticketStore

    if (ticketStep.validateTicket) {
      const error = ticketStep.validateTicket(TicketTypeNode.CONFERENCE)

      if (error === VALIDATION_ERROR_TYPE.NO_OPTION_SELECTED) {
        toast.error(t('ticket:error.noOptionSelected'))

        return false
      }

      if (error === VALIDATION_ERROR_TYPE.NOT_AGREED_TO_OPTIONS) {
        toast.error(t('ticket:error.notAgreeToOptions'))

        return false
      }
    }
    setPayingTicket(ticketStep)
    router.push(paths.ticket.payment)

    return false
  }

  renderTicketBoxList = () => {
    const { stores, t } = this.props
    const {
      conferenceProducts,
      setPrice,
      getTicketStep,
      getIsTicketStepExist,
      setTicketStep,
      getMyConferenceTickets
    } = stores.ticketStore
    const myConferenceTicket = toJS(getMyConferenceTickets()[0])
    if (_.isEmpty(conferenceProducts)){
      return (
        <AlertBar text={t('ticket:common.noTicketAlert')} />
      )
    }
    return conferenceProducts.map((conferenceProduct) => {
      const { id, name, desc, warning, price, isEditablePrice, ticketOpenAt, ticketCloseAt, isSoldOut } = conferenceProduct
      const isTicketStepExist = getIsTicketStepExist(id)
      if (!isTicketStepExist) setTicketStep(id, name)
      const ticketStep = getTicketStep(id)

      if (!ticketStep) return null

      const {
        ticketStepState,
        setTicketStepState, setTicketOption, setTicketOptionAgreed, setTicketTermsAgreed,
        ticketOption, isTicketOptionAgreed, isTermsAgreed,
        initConferenceTicketOptions
      } = ticketStep

      let options = null

      if (ticketStepState === TICKET_STEP.BUYING) {
        options = (
          <TicketDescription
            t={t}
            title={name || ''}
            description={desc}
            warning={warning}
          />
        )
      }

      if (ticketStepState === TICKET_STEP.AGREE_TERMS) {
        options = (
          <TermsAgreement
            t={t}
            title={name || ''}
            id={id}
            isTermsAgreed={isTermsAgreed}
            onCancel={initConferenceTicketOptions}
            onChangeAgreed={setTicketTermsAgreed}
          />
        )
      }
      if (ticketStepState === TICKET_STEP.SELECT_OPTION) {
        options = (
          <ConferenceTicketOption
            t={t}
            title={name || ''}
            id={id}
            tshirtsize={ticketOption && ticketOption.tshirtsize || ''}
            isTicketAgreed={isTicketOptionAgreed}
            onCancel={initConferenceTicketOptions}
            onChangeOption={setTicketOption}
            onChangeAgreed={setTicketOptionAgreed}
          />
        )
      }

      let isPaid = null
      if (!_.isEmpty(myConferenceTicket)) {
        isPaid = myConferenceTicket.product.id === id
      }

      return (
        <TicketBox
          t={t}
          key={`ticketBox_${id}`}
          ticketColor={TICKET_COLOR.CONFERENCE}
          ticketButtonTitle={this.getTicketButtonTitle(ticketStepState)}
          price={price}
          isEditablePrice={isEditablePrice}
          setPrice={setPrice}
          startDate={ticketOpenAt}
          endDate={ticketCloseAt}
          isSoldOut={isSoldOut}
          onNextStep={setTicketStepState}
          stepAction={this.getStepAction(ticketStep)}
          nextStep={this.getNextTicketStep(ticketStepState)}
          options={options}
          isPaid={isPaid}
        />
      )
    })
  }

  render() {
    const { stores } = this.props
    const { authStore } = stores
    const isAuthStoreInitialized = authStore.isInitialized
    const isLoggedIn = authStore.loggedIn

    if (!isAuthStoreInitialized) {
      return <Loading width={50} height={50}/>
    }

    return (
      !isLoggedIn
      ? <FormNeedsLogin />
      :  this.renderTicketBoxList()
    )
  }
}

export default ConferenceTicketList

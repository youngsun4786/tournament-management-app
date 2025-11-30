import { createFormHook } from '@tanstack/react-form'

import {
    Select,
    SubscribeButton,
    TextArea,
    TextField,
} from '~/lib/components/form-components'
import { fieldContext, formContext } from '../hooks/form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

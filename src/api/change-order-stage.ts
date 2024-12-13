import { api } from '@/lib/axios'

export interface ChangeOrderStageRequest {
  id: string
  stage: string
  
}

export async function changeOrderStage({
  id,
  stage,
  
}: ChangeOrderStageRequest) {
  await api.patch('/orders/change-order-stage', {
    id,
    stage,
  })
}

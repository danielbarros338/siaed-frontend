import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type StepIndicatorProps = {
  steps: readonly string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const total = steps.length
  const progress = ((currentStep - 1) / (total - 1)) * 100

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-200">
          <div
            className="h-full bg-[#003a8c] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {steps.map((label, index) => {
          const stepNum = index + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300',
                  isDone && 'border-[#003a8c] bg-[#003a8c] text-white',
                  isActive && 'border-[#003a8c] bg-white text-[#003a8c] shadow-[0_0_0_3px_rgba(0,58,140,0.12)]',
                  !isDone && !isActive && 'border-slate-300 bg-white text-slate-400'
                )}
              >
                {isDone ? <Check className="size-3.5 stroke-[2.5]" /> : stepNum}
              </div>
              <span
                className={cn(
                  'hidden text-[0.6rem] font-semibold uppercase tracking-[0.15em] sm:block',
                  isActive ? 'text-[#003a8c]' : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
        Passo {currentStep} de {total}
      </p>
    </div>
  )
}

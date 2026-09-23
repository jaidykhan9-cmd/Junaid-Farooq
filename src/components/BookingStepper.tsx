import React from 'react';
import {
  Zap,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  Camera,
  ClipboardCheck,
  CheckCircle2,
  Check,
} from 'lucide-react';

export interface BookingStepDef {
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BOOKING_STEPS: BookingStepDef[] = [
  { number: 1, label: 'Service', shortLabel: 'Service', icon: Zap },
  { number: 2, label: 'Problem', shortLabel: 'Problem', icon: AlertCircle },
  { number: 3, label: 'Schedule', shortLabel: 'Schedule', icon: Calendar },
  { number: 4, label: 'Contact', shortLabel: 'Contact', icon: User },
  { number: 5, label: 'Location', shortLabel: 'Location', icon: MapPin },
  { number: 6, label: 'Media', shortLabel: 'Photos', icon: Camera },
  { number: 7, label: 'Review', shortLabel: 'Review', icon: ClipboardCheck },
  { number: 8, label: 'Confirmed', shortLabel: 'Done', icon: CheckCircle2 },
];

interface BookingStepperProps {
  currentStep: number; // 1 to 7 during flow, 8 when submitted/confirmed
  isConfirmed?: boolean;
  onStepClick?: (stepNumber: number) => void;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  isConfirmed = false,
  onStepClick,
}) => {
  const effectiveStep = isConfirmed ? 8 : currentStep;
  const progressPercent = Math.round((effectiveStep / 8) * 100);

  return (
    <div className="w-full bg-[#3f0f1b] border-b border-[#d4af37]/20 px-4 sm:px-6 py-3.5 select-none">
      {/* Mobile Compact Header & Progress Summary */}
      <div className="flex md:hidden items-center justify-between text-xs mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#d4af37] text-[#3f0f1a] font-bold text-[10px]">
            {effectiveStep}
          </span>
          <span className="font-semibold text-[#f3e5ab]">
            {BOOKING_STEPS[effectiveStep - 1]?.label || 'Dispatch Protocol'}
          </span>
          <span className="text-[10px] text-[#e2cbb0]">
            ({effectiveStep}/8)
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#d4af37] font-semibold">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Progress Track Bar for Mobile */}
      <div className="w-full h-1.5 bg-[#5c1626] rounded-full overflow-hidden mb-3 md:hidden">
        <div
          className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Full 8-Step Visual Stepper (Desktop & Tablet Horizontal Timeline) */}
      <div className="relative">
        {/* Continuous Connecting Line Background */}
        <div className="hidden md:block absolute top-[18px] left-[32px] right-[32px] h-[2px] bg-[#5c1626] -z-0" />
        
        {/* Dynamic Highlighted Progress Line */}
        <div
          className="hidden md:block absolute top-[18px] left-[32px] h-[2px] bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] transition-all duration-500 -z-0"
          style={{
            width: effectiveStep > 1
              ? `calc(${((effectiveStep - 1) / (BOOKING_STEPS.length - 1)) * 100}% - 40px)`
              : '0%',
          }}
        />

        {/* 8 Stepper Nodes Grid / Flex */}
        <div className="flex items-start justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
          {BOOKING_STEPS.map((step) => {
            const isCompleted = isConfirmed ? step.number < 8 : step.number < currentStep;
            const isCurrent = isConfirmed ? step.number === 8 : step.number === currentStep;
            const isUpcoming = isConfirmed ? false : step.number > currentStep;
            const StepIcon = step.icon;

            const isClickable = !isConfirmed && onStepClick && step.number < currentStep;

            return (
              <div
                key={step.number}
                onClick={() => {
                  if (isClickable) {
                    onStepClick(step.number);
                  }
                }}
                className={`flex-1 min-w-[50px] flex flex-col items-center group relative ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                title={isClickable ? `Jump back to ${step.label}` : step.label}
              >
                {/* Node Icon Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                    isCompleted
                      ? 'bg-[#d4af37] text-[#3f0f1a] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : isCurrent
                      ? 'bg-[#641b2c] text-[#f3e5ab] border-2 border-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.5)] ring-4 ring-[#d4af37]/20 scale-105'
                      : 'bg-[#4c1320] text-[#c4b5a5] border border-white/10 group-hover:border-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}

                  {/* Pulsing indicator on current active step */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping" />
                  )}
                </div>

                {/* Step Text Label */}
                <div className="mt-1.5 text-center">
                  <div
                    className={`text-[10px] uppercase font-bold tracking-tight transition-colors line-clamp-1 ${
                      isCurrent
                        ? 'text-[#f3e5ab] font-extrabold drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]'
                        : isCompleted
                        ? 'text-[#d4af37]'
                        : 'text-[#6f5b50]'
                    }`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </div>

                  <div className="hidden lg:block text-[9px] text-[#8e7467] font-mono leading-none mt-0.5">
                    Step {step.number}
                  </div>
                </div>

                {/* Hover indicator for past clickable steps */}
                {isClickable && (
                  <div className="hidden group-hover:block absolute -bottom-4 text-[9px] text-[#d4af37] underline whitespace-nowrap">
                    Edit
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

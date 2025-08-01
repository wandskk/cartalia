import { ref, computed } from 'vue';

interface Step {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  disabled?: boolean;
}

interface UseStepsOptions {
  steps: Step[];
  initialStep?: number;
  allowBackward?: boolean;
  validateStep?: (step: number) => boolean;
}

export function useSteps(options: UseStepsOptions) {
  const {
    steps,
    initialStep = 0,
    allowBackward = true,
    validateStep
  } = options;

  const currentStep = ref(initialStep);
  const completedSteps = ref<Set<number>>(new Set());

  const totalSteps = computed(() => steps.length);
  const isFirstStep = computed(() => currentStep.value === 0);
  const isLastStep = computed(() => totalSteps.value === 0 || currentStep.value === totalSteps.value - 1);
  const canGoNext = computed(() => totalSteps.value > 0 && !isLastStep.value);
  const canGoBack = computed(() => totalSteps.value > 0 && !isFirstStep.value && allowBackward);
  const progress = computed(() => totalSteps.value === 0 ? 0 : ((currentStep.value + 1) / totalSteps.value) * 100);

  const currentStepData = computed(() => steps[currentStep.value]);
  const nextStepData = computed(() => 
    canGoNext.value ? steps[currentStep.value + 1] : null
  );
  const prevStepData = computed(() => 
    canGoBack.value ? steps[currentStep.value - 1] : null
  );

  function nextStep(): boolean {
    if (!canGoNext.value) return false;


    if (validateStep && !validateStep(currentStep.value)) {
      return false;
    }


    completedSteps.value.add(currentStep.value);
    
    currentStep.value++;
    return true;
  }

  function previousStep(): boolean {
    if (!canGoBack.value) return false;
    
    currentStep.value--;
    return true;
  }

  function goToStep(step: number): boolean {
    if (step < 0 || step >= totalSteps.value) return false;
    

    if (step > currentStep.value) {
      for (let i = currentStep.value; i < step; i++) {
        if (validateStep && !validateStep(i)) {
          return false;
        }
      }
    }
    
    currentStep.value = step;
    return true;
  }

  function goToFirstStep(): void {
    currentStep.value = 0;
  }

  function goToLastStep(): void {
    currentStep.value = totalSteps.value - 1;
  }

  function markStepCompleted(step: number): void {
    if (step >= 0 && step < totalSteps.value) {
      completedSteps.value.add(step);
    }
  }

  function markStepIncomplete(step: number): void {
    completedSteps.value.delete(step);
  }

  function isStepCompleted(step: number): boolean {
    return completedSteps.value.has(step);
  }

  function isStepDisabled(step: number): boolean {
    const stepData = steps[step];
    return stepData?.disabled || false;
  }

  function reset(): void {
    currentStep.value = initialStep;
    completedSteps.value.clear();
  }

  function getStepStatus(step: number): 'completed' | 'current' | 'pending' | 'disabled' {
    if (isStepDisabled(step)) return 'disabled';
    if (isStepCompleted(step)) return 'completed';
    if (step === currentStep.value) return 'current';
    return 'pending';
  }


  const stepsWithStatus = computed(() => {
    return steps.map((step, index) => ({
      ...step,
      status: getStepStatus(index),
      isCompleted: isStepCompleted(index),
      isCurrent: index === currentStep.value,
      isDisabled: isStepDisabled(index)
    }));
  });

  return {

    currentStep,
    completedSteps,
    

    totalSteps,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoBack,
    progress,
    currentStepData,
    nextStepData,
    prevStepData,
    stepsWithStatus,
    

    nextStep,
    previousStep,
    goToStep,
    goToFirstStep,
    goToLastStep,
    markStepCompleted,
    markStepIncomplete,
    isStepCompleted,
    isStepDisabled,
    getStepStatus,
    reset
  };
} 
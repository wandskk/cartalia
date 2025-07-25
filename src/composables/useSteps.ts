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
  const isLastStep = computed(() => currentStep.value === totalSteps.value - 1);
  const canGoNext = computed(() => !isLastStep.value);
  const canGoBack = computed(() => !isFirstStep.value && allowBackward);
  const progress = computed(() => ((currentStep.value + 1) / totalSteps.value) * 100);

  const currentStepData = computed(() => steps[currentStep.value]);
  const nextStepData = computed(() => 
    canGoNext.value ? steps[currentStep.value + 1] : null
  );
  const prevStepData = computed(() => 
    canGoBack.value ? steps[currentStep.value - 1] : null
  );

  function nextStep(): boolean {
    if (!canGoNext.value) return false;

    // Validate current step if validator is provided
    if (validateStep && !validateStep(currentStep.value)) {
      return false;
    }

    // Mark current step as completed
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
    
    // If going forward, validate all intermediate steps
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

  // Get all steps with their current status
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
    // State
    currentStep,
    completedSteps,
    
    // Computed
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
    
    // Methods
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
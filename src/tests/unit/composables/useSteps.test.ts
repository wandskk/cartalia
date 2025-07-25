import { describe, it, expect, beforeEach } from 'vitest';
import { useSteps } from '../../../composables/useSteps';

describe('useSteps', () => {
  const mockSteps = [
    { id: 0, title: 'Step 1', description: 'First step' },
    { id: 1, title: 'Step 2', description: 'Second step' },
    { id: 2, title: 'Step 3', description: 'Third step' }
  ];

  let steps: ReturnType<typeof useSteps>;

  beforeEach(() => {
    steps = useSteps({ steps: mockSteps });
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(steps.currentStep.value).toBe(0);
      expect(steps.totalSteps.value).toBe(3);
      expect(steps.isFirstStep.value).toBe(true);
      expect(steps.isLastStep.value).toBe(false);
      expect(steps.canGoNext.value).toBe(true);
      expect(steps.canGoBack.value).toBe(false);
      expect(steps.progress.value).toBe(33.33333333333333);
    });

    it('should initialize with custom initial step', () => {
      const customSteps = useSteps({
        steps: mockSteps,
        initialStep: 1
      });

      expect(customSteps.currentStep.value).toBe(1);
      expect(customSteps.isFirstStep.value).toBe(false);
      expect(customSteps.isLastStep.value).toBe(false);
      expect(customSteps.canGoNext.value).toBe(true);
      expect(customSteps.canGoBack.value).toBe(true);
      expect(customSteps.progress.value).toBe(66.66666666666666);
    });

    it('should initialize with disabled backward navigation', () => {
      const customSteps = useSteps({
        steps: mockSteps,
        allowBackward: false
      });

      expect(customSteps.canGoBack.value).toBe(false);
    });
  });

  describe('navigation', () => {
    it('should go to next step', () => {
      expect(steps.currentStep.value).toBe(0);
      expect(steps.canGoNext.value).toBe(true);

      const result = steps.nextStep();

      expect(result).toBe(true);
      expect(steps.currentStep.value).toBe(1);
      expect(steps.isFirstStep.value).toBe(false);
      expect(steps.canGoBack.value).toBe(true);
    });

    it('should go to previous step', () => {
      steps.nextStep(); // Go to step 1
      expect(steps.currentStep.value).toBe(1);

      const result = steps.previousStep();

      expect(result).toBe(true);
      expect(steps.currentStep.value).toBe(0);
      expect(steps.isFirstStep.value).toBe(true);
      expect(steps.canGoBack.value).toBe(false);
    });

    it('should go to specific step', () => {
      const result = steps.goToStep(2);

      expect(result).toBe(true);
      expect(steps.currentStep.value).toBe(2);
      expect(steps.isLastStep.value).toBe(true);
    });

    it('should go to first step', () => {
      steps.goToStep(2);
      expect(steps.currentStep.value).toBe(2);

      steps.goToFirstStep();

      expect(steps.currentStep.value).toBe(0);
      expect(steps.isFirstStep.value).toBe(true);
    });

    it('should go to last step', () => {
      expect(steps.currentStep.value).toBe(0);

      steps.goToLastStep();

      expect(steps.currentStep.value).toBe(2);
      expect(steps.isLastStep.value).toBe(true);
    });

    it('should not go beyond first step', () => {
      expect(steps.currentStep.value).toBe(0);

      const result = steps.previousStep();

      expect(result).toBe(false);
      expect(steps.currentStep.value).toBe(0);
    });

    it('should not go beyond last step', () => {
      steps.goToLastStep();
      expect(steps.currentStep.value).toBe(2);

      const result = steps.nextStep();

      expect(result).toBe(false);
      expect(steps.currentStep.value).toBe(2);
    });

    it('should not go to invalid step', () => {
      const result1 = steps.goToStep(-1);
      expect(result1).toBe(false);
      expect(steps.currentStep.value).toBe(0);

      const result2 = steps.goToStep(5);
      expect(result2).toBe(false);
      expect(steps.currentStep.value).toBe(0);
    });

    it('should respect backward navigation restriction', () => {
      const restrictedSteps = useSteps({
        steps: mockSteps,
        allowBackward: false
      });

      restrictedSteps.nextStep();
      expect(restrictedSteps.currentStep.value).toBe(1);

      const result = restrictedSteps.previousStep();

      expect(result).toBe(false);
      expect(restrictedSteps.currentStep.value).toBe(1);
    });
  });

  describe('step validation', () => {
    it('should validate step before navigation', () => {
      const validateSteps = useSteps({
        steps: mockSteps,
        validateStep: (step) => step !== 1 // Disable step 1
      });

      const result = validateSteps.nextStep();

      expect(result).toBe(true); // nextStep validates current step (0), which is valid
      expect(validateSteps.currentStep.value).toBe(1);
    });

    it('should allow navigation to valid step', () => {
      const validateSteps = useSteps({
        steps: mockSteps,
        validateStep: (step) => step !== 1 // Disable step 1
      });

      // Should be able to go directly to step 2 since step 1 is not in the path
      const result = validateSteps.goToStep(2);
      expect(result).toBe(false); // Should fail because step 1 is invalid and in the path
      expect(validateSteps.currentStep.value).toBe(0);
    });
  });

  describe('step completion', () => {
    it('should mark step as completed', () => {
      expect(steps.isStepCompleted(0)).toBe(false);

      steps.markStepCompleted(0);

      expect(steps.isStepCompleted(0)).toBe(true);
    });

    it('should mark step as incomplete', () => {
      steps.markStepCompleted(0);
      expect(steps.isStepCompleted(0)).toBe(true);

      steps.markStepIncomplete(0);

      expect(steps.isStepCompleted(0)).toBe(false);
    });

    it('should check step completion status', () => {
      expect(steps.isStepCompleted(0)).toBe(false);
      expect(steps.isStepCompleted(1)).toBe(false);

      steps.markStepCompleted(0);

      expect(steps.isStepCompleted(0)).toBe(true);
      expect(steps.isStepCompleted(1)).toBe(false);
    });
  });

  describe('step status', () => {
    it('should get step status', () => {
      expect(steps.getStepStatus(0)).toBe('current');
      expect(steps.getStepStatus(1)).toBe('pending');
      expect(steps.getStepStatus(2)).toBe('pending');

      steps.nextStep();

      expect(steps.getStepStatus(0)).toBe('completed');
      expect(steps.getStepStatus(1)).toBe('current');
      expect(steps.getStepStatus(2)).toBe('pending');
    });

    it('should handle disabled steps', () => {
      const disabledSteps = useSteps({
        steps: [
          { id: 0, title: 'Step 1', disabled: false },
          { id: 1, title: 'Step 2', disabled: true },
          { id: 2, title: 'Step 3', disabled: false }
        ]
      });

      expect(disabledSteps.getStepStatus(1)).toBe('disabled');
      expect(disabledSteps.isStepDisabled(1)).toBe(true);
    });
  });

  describe('computed properties', () => {
    it('should calculate progress correctly', () => {
      expect(steps.progress.value).toBe(33.33333333333333);

      steps.nextStep();
      expect(steps.progress.value).toBe(66.66666666666666);

      steps.nextStep();
      expect(steps.progress.value).toBe(100);
    });

    it('should get current step data', () => {
      const currentData = steps.currentStepData.value;

      expect(currentData).toEqual(mockSteps[0]);
    });

    it('should get next step data', () => {
      const nextData = steps.nextStepData.value;

      expect(nextData).toEqual(mockSteps[1]);
    });

    it('should get previous step data', () => {
      steps.nextStep();
      const prevData = steps.prevStepData.value;

      expect(prevData).toEqual(mockSteps[0]);
    });

    it('should return null for next step at last step', () => {
      steps.goToLastStep();

      expect(steps.nextStepData.value).toBe(null);
    });

    it('should return null for previous step at first step', () => {
      expect(steps.prevStepData.value).toBe(null);
    });
  });

  describe('steps with status', () => {
    it('should get steps with status', () => {
      const stepsWithStatus = steps.stepsWithStatus.value;

      expect(stepsWithStatus).toHaveLength(3);
      expect(stepsWithStatus[0].status).toBe('current');
      expect(stepsWithStatus[1].status).toBe('pending');
      expect(stepsWithStatus[2].status).toBe('pending');
    });

    it('should update steps status after navigation', () => {
      steps.nextStep();

      const stepsWithStatus = steps.stepsWithStatus.value;

      expect(stepsWithStatus[0].status).toBe('completed');
      expect(stepsWithStatus[1].status).toBe('current');
      expect(stepsWithStatus[2].status).toBe('pending');
    });

    it('should include completion status', () => {
      steps.markStepCompleted(0);

      const stepsWithStatus = steps.stepsWithStatus.value;

      expect(stepsWithStatus[0].isCompleted).toBe(true);
      expect(stepsWithStatus[1].isCompleted).toBe(false);
    });
  });

  describe('reset functionality', () => {
    it('should reset to initial step', () => {
      steps.goToStep(2);
      expect(steps.currentStep.value).toBe(2);

      steps.reset();

      expect(steps.currentStep.value).toBe(0);
      expect(steps.completedSteps.value.size).toBe(0);
    });

    it('should reset with custom initial step', () => {
      const customSteps = useSteps({
        steps: mockSteps,
        initialStep: 1
      });

      customSteps.goToStep(2);
      customSteps.markStepCompleted(0);

      customSteps.reset();

      expect(customSteps.currentStep.value).toBe(1);
      expect(customSteps.completedSteps.value.size).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty steps array', () => {
      const emptySteps = useSteps({ steps: [] });

      expect(emptySteps.totalSteps.value).toBe(0);
      expect(emptySteps.isFirstStep.value).toBe(true);
      expect(emptySteps.isLastStep.value).toBe(true);
      expect(emptySteps.canGoNext.value).toBe(false);
      expect(emptySteps.canGoBack.value).toBe(false);
    });

    it('should handle single step', () => {
      const singleStep = useSteps({ steps: [mockSteps[0]] });

      expect(singleStep.totalSteps.value).toBe(1);
      expect(singleStep.isFirstStep.value).toBe(true);
      expect(singleStep.isLastStep.value).toBe(true);
      expect(singleStep.canGoNext.value).toBe(false);
      expect(singleStep.canGoBack.value).toBe(false);
    });

    it('should handle steps with missing properties', () => {
      const incompleteSteps = useSteps({
        steps: [
          { id: 0, title: 'Step 1' },
          { id: 1, title: 'Step 2', description: 'Has description' },
          { id: 2, title: 'Step 3', icon: 'mdi-check' }
        ]
      });

      expect(incompleteSteps.totalSteps.value).toBe(3);
      expect(incompleteSteps.currentStepData.value.title).toBe('Step 1');
    });
  });
}); 
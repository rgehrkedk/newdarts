import * as Haptics from 'expo-haptics';

/**
 * Utility functions for haptic feedback throughout the application
 */

/**
 * Light impact haptic feedback
 * For small UI elements, selections, or toggling states
 */
export const lightImpact = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium impact haptic feedback
 * For confirming actions, selections with moderate importance
 */
export const mediumImpact = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Heavy impact haptic feedback
 * For important actions, significant changes, or emphatic feedback
 */
export const heavyImpact = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Success feedback
 * For successful operations, completions, or positive outcomes
 */
export const successFeedback = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Warning feedback
 * For warning messages, alerts that require attention
 */
export const warningFeedback = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Error feedback
 * For error messages, failed operations, or critical alerts
 */
export const errorFeedback = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Selection feedback - lightest feedback
 * For standard selection operations like pressing buttons
 * This is the most subtle haptic feedback available
 */
export const selectionFeedback = async () => {
  await Haptics.selectionAsync();
};

/**
 * Extremely subtle selection feedback
 * Alias for selectionFeedback, the lightest haptic option
 * Ideal for very frequent interactions or subtle UI elements
 */
export const subtleFeedback = selectionFeedback;

/**
 * Custom sequence of haptic feedback
 * For creating unique feedback patterns for specific actions
 * @param pattern Array of feedback functions to execute in sequence
 * @param delay Delay in ms between feedback events
 */
export const sequenceFeedback = async (
  pattern: (() => Promise<void>)[],
  delay = 100
) => {
  for (const feedback of pattern) {
    await feedback();
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

/**
 * Special haptic feedback for leg completion
 * Creates a celebratory escalating pattern
 */
export const legCompletionFeedback = async () => {
  // Celebratory pattern that builds up and culminates
  await lightImpact();
  await new Promise((resolve) => setTimeout(resolve, 70));
  await lightImpact();
  await new Promise((resolve) => setTimeout(resolve, 50));
  await mediumImpact();
  await new Promise((resolve) => setTimeout(resolve, 100));
  await heavyImpact();
  await new Promise((resolve) => setTimeout(resolve, 150));
  await successFeedback();
};

/**
 * Special haptic feedback for hitting a 180
 * Imitates the "one hundred and eighty" announcement with
 * rhythmic pattern that matches the classic darts call
 */
export const oneEightyFeedback = async () => {
  // "Oooone"
  await mediumImpact();
  await new Promise((resolve) => setTimeout(resolve, 100));
  await mediumImpact();
  await new Promise((resolve) => setTimeout(resolve, 100));


  // "Hundred"
  await lightImpact();
  await new Promise((resolve) => setTimeout(resolve, 50));
  await mediumImpact();
  await new Promise((resolve) => setTimeout(resolve, 30));
  await lightImpact();
  await new Promise((resolve) => setTimeout(resolve, 100));

  // "and"
  await lightImpact();
  await new Promise((resolve) => setTimeout(resolve, 400));

  // "Eeeeeigh-ty!"
  await mediumImpact();
  await new Promise((resolve) => setTimeout(resolve, 80));
  await heavyImpact();
  await new Promise((resolve) => setTimeout(resolve, 60));
  await heavyImpact();
  await new Promise((resolve) => setTimeout(resolve, 600));
  await mediumImpact();
  await new Promise((resolve) => setTimeout(resolve, 80));

  // Final celebration
  await successFeedback();
};

const haptics = {
  lightImpact,
  mediumImpact,
  heavyImpact,
  successFeedback,
  warningFeedback,
  errorFeedback,
  selectionFeedback,
  subtleFeedback,
  sequenceFeedback,
  legCompletionFeedback,
  oneEightyFeedback,
};

export default haptics;
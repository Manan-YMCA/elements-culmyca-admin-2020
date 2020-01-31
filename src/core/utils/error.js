
export function getFormattedError(error) {
  /**
   * !! Errors ending with resolvment statements should not occur in ideal cases.
   * !! If they are encountered, they must be due to malicious access approach or faulty frontend
   */
  switch (error.type) {
    default:
      return 'Something went wrong! Please be informed the issue is being resolved.';
  }
}

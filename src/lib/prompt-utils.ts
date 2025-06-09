import * as eta from 'eta';

/**
 * Formats a template string using the 'eta' templating library.
 *
 * @param template The template string (can contain eta syntax like <% %> or <%= %>) or a simple string.
 * @param variables An object containing variables to be used in the template.
 * @returns The rendered string.
 */
export function formatPrompt(template: string, variables: Record<string, any>): string {
  if (!template) {
    return '';
  }

  // Check if the template string contains any potential eta syntax markers.
  // This is a simple heuristic; a more robust check might involve parsing.
  // For our case, checking for common delimiters like <%, <%=, <#, <~ is likely sufficient.
  const hasTemplateSyntax = /[<][%=#~]/.test(template);

  if (hasTemplateSyntax) {
    try {
      // Eta render expects a string template and data
      return eta.render(template, variables) as string;
    } catch (error) {
      console.error('Error rendering template with eta:', error);
      // Fallback to returning the original template or a simplified version
      return template;
    }
  } else {
    // If no apparent template syntax, return the string as is.
    // We could optionally perform a simple variable substitution here if needed,
    // but for this requirement, just returning the string is sufficient.
    return template;
  }
}
export type EmployeeForm = {
  firstName: string;
  lastName: string;
  email: string;
  joiningDate: string;
};
export type FieldErrors = Partial<Record<keyof EmployeeForm, string>>;
export function validateEmployee(value: EmployeeForm): FieldErrors {
  const errors: FieldErrors = {};
  if (value.firstName.trim().length < 2)
    errors.firstName = 'First name must be at least 2 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(value.firstName))
    errors.firstName = 'First name can only contain letters';
  if (value.lastName.trim().length < 2) errors.lastName = 'Last name must be at least 2 characters';
  if (!/^\S+@\S+\.\S+$/.test(value.email)) errors.email = 'Enter a valid email address';
  if (!value.joiningDate || Number.isNaN(Date.parse(value.joiningDate)))
    errors.joiningDate = 'Enter a valid date';
  return errors;
}

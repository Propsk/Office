import { toast } from 'react-toastify';

/**
 * Delete a property with confirmation
 * @param {string} propertyId - The ID of the property to delete
 * @param {string} propertyName - The name of the property (for the confirmation message)
 * @param {function} onSuccess - Callback function to execute after successful deletion
 * @param {function} setLoading - Function to update loading state
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
export const deleteProperty = async (
  propertyId, 
  propertyName = 'this property', 
  onSuccess = () => {}, 
  setLoading = null
) => {
  // Request confirmation
  const confirmed = window.confirm(`Are you sure you want to delete ${propertyName}?`);
  if (!confirmed) return false;
  
  // Set loading state if provided
  if (setLoading) setLoading(true);
  
  try {
    const res = await fetch(`/api/properties/${propertyId}`, { 
      method: 'DELETE' 
    });
    
    if (res.ok) {
      toast.success('Property deleted successfully');
      onSuccess();
      return true;
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.message || 'Failed to delete property');
      return false;
    }
  } catch (error) {
    console.error('Error deleting property:', error);
    toast.error('Something went wrong');
    return false;
  } finally {
    // Reset loading state if provided
    if (setLoading) setLoading(false);
  }
};
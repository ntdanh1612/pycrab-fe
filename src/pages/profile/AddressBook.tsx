import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, ArrowLeft, Home, Loader2, MapPin, MoreHorizontal, Plus, Star, Trash } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Address } from '@/stores/profile.store'

// List of countries for the dropdown
const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
]

// US states for state dropdown
const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }, { value: 'DC', label: 'District of Columbia' }
]

// Initial empty form state
const initialAddressFormState = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'us',
  phone: '',
  isDefault: false,
}

export default function AddressBook() {
  const { addresses, loading, error, clearError, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useProfileStore()
  const navigate = useNavigate()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState(initialAddressFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deletingAddress, setDeletingAddress] = useState<string | null>(null)

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressForm(prev => ({ ...prev, [name]: value }))
    
    // Clear errors/messages when user starts typing
    if (formError) setFormError(null)
    if (error) clearError()
    if (successMessage) setSuccessMessage(null)
  }

  const handleCheckboxChange = (checked: boolean) => {
    setAddressForm(prev => ({ ...prev, isDefault: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setAddressForm(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setAddressForm(initialAddressFormState)
    setEditingAddressId(null)
    setShowAddForm(false)
    setFormError(null)
    clearError()
  }

  const validateForm = () => {
    if (!addressForm.name.trim()) {
      setFormError('Name is required')
      return false
    }
    
    if (!addressForm.addressLine1.trim()) {
      setFormError('Address line 1 is required')
      return false
    }
    
    if (!addressForm.city.trim()) {
      setFormError('City is required')
      return false
    }
    
    if (!addressForm.state.trim()) {
      setFormError('State/Province is required')
      return false
    }
    
    if (!addressForm.postalCode.trim()) {
      setFormError('Postal/ZIP code is required')
      return false
    }
    
    if (!addressForm.phone.trim()) {
      setFormError('Phone number is required')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      if (editingAddressId) {
        // Update existing address
        await updateAddress(editingAddressId, addressForm)
        
        // If this is set as default, update it
        if (addressForm.isDefault) {
          await setDefaultAddress(editingAddressId)
        }
        
        setSuccessMessage('Address updated successfully')
      } else {
        // Add new address
        await addAddress(addressForm)
        setSuccessMessage('Address added successfully')
      }
      
      // Reset form after successful submission
      resetForm()
      
      // Refresh addresses
      await fetchAddresses()
    } catch (err) {
      // Error will be set in the store
    }
  }

  const handleEdit = (address: Address) => {
    setAddressForm({
      name: address.name,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    })
    
    setEditingAddressId(address.id)
    setShowAddForm(true)
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingAddress(id)
      await deleteAddress(id)
      setSuccessMessage('Address deleted successfully')
      
      // Refresh addresses
      await fetchAddresses()
    } catch (err) {
      // Error will be set in the store
    } finally {
      setDeletingAddress(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id)
      setSuccessMessage('Default address updated')
      
      // Refresh addresses
      await fetchAddresses()
    } catch (err) {
      // Error will be set in the store
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Profile
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Address Book</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your shipping and billing addresses</p>
          </div>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingAddressId ? 'Edit Address' : 'Add New Address'}</CardTitle>
              <CardDescription>
                {editingAddressId 
                  ? 'Update your existing address information'
                  : 'Enter a new shipping or billing address'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={addressForm.name}
                    onChange={handleChange}
                    placeholder="Full name of recipient"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={addressForm.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province/Region</Label>
                    {addressForm.country === 'us' ? (
                      <Select 
                        value={addressForm.state} 
                        onValueChange={(value) => handleSelectChange('state', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map(state => (
                            <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleChange}
                        placeholder="State/Province/Region"
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP/Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleChange}
                      placeholder="ZIP or Postal code"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={addressForm.country} 
                      onValueChange={(value) => handleSelectChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleChange}
                    placeholder="Phone number for delivery questions"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="isDefault"
                    checked={addressForm.isDefault}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                    Set as default address
                  </Label>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingAddressId ? 'Update Address' : 'Add Address'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && !addresses.length ? (
            // Show loading skeleton if loading and no addresses yet
            [...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between">
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : addresses.length > 0 ? (
            // Show addresses
            addresses.map((address) => (
              <Card key={address.id} className={address.isDefault ? 'border-2 border-primary' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center text-base">
                        <Home className="mr-2 h-4 w-4" />
                        {address.name}
                        {address.isDefault && (
                          <Badge variant="default" className="ml-2">Default</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Shipping Address</CardDescription>
                    </div>
                    {deletingAddress === address.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-sm space-y-1">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>
                      {COUNTRIES.find(c => c.value === address.country)?.label || address.country}
                    </p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      title="Set as default address"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Set as Default
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            // No addresses
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Addresses Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't added any addresses yet. Add your first address to get started.
                    </p>
                    {!showAddForm && (
                      <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
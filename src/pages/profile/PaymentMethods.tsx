import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '@/stores/profile.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, ArrowLeft, CreditCard, Loader2, Plus, Star, Trash } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import type { PaymentMethod } from '@/stores/profile.store'

// Card types with their icons/classes
const CARD_TYPES = [
  { value: 'visa', label: 'Visa', icon: '💳' },
  { value: 'mastercard', label: 'Mastercard', icon: '💳' },
  { value: 'amex', label: 'American Express', icon: '💳' },
  { value: 'discover', label: 'Discover', icon: '💳' },
]

// Payment types
const PAYMENT_TYPES = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'applepay', label: 'Apple Pay' },
  { value: 'googlepay', label: 'Google Pay' },
]

// Months for expiry date
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1
  return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') }
})

// Years for expiry date (current year + 10 years)
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 11 }, (_, i) => {
  const year = currentYear + i
  return { value: year.toString(), label: year.toString() }
})

// Initial empty form state
const initialPaymentFormState = {
  type: 'card',
  cardNumber: '',
  cardType: 'visa',
  expiryMonth: MONTHS[0].value,
  expiryYear: YEARS[0].value,
  nameOnCard: '',
  isDefault: false,
}

export default function PaymentMethods() {
  const { paymentMethods, loading, error, clearError, fetchPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = useProfileStore()
  const navigate = useNavigate()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
  const [paymentForm, setPaymentForm] = useState(initialPaymentFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deletingPayment, setDeletingPayment] = useState<string | null>(null)

  // Load payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      
      // Limit to 16 digits
      const truncated = digitsOnly.slice(0, 16)
      
      // Format with spaces
      let formatted = ''
      for (let i = 0; i < truncated.length; i += 4) {
        const chunk = truncated.slice(i, i + 4)
        formatted += chunk + (i + 4 < truncated.length ? ' ' : '')
      }
      
      setPaymentForm(prev => ({ ...prev, [name]: formatted }))
    } else {
      setPaymentForm(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear errors/messages when user starts typing
    if (formError) setFormError(null)
    if (error) clearError()
    if (successMessage) setSuccessMessage(null)
  }

  const handleCheckboxChange = (checked: boolean) => {
    setPaymentForm(prev => ({ ...prev, isDefault: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setPaymentForm(initialPaymentFormState)
    setEditingPaymentId(null)
    setShowAddForm(false)
    setFormError(null)
    clearError()
  }

  const validateForm = () => {
    if (paymentForm.type === 'card') {
      // Only validate card fields if the type is card
      if (!paymentForm.cardNumber.trim()) {
        setFormError('Card number is required')
        return false
      }
      
      // Check if card number has at least 13 digits (min for valid cards)
      const digitsOnly = paymentForm.cardNumber.replace(/\D/g, '')
      if (digitsOnly.length < 13) {
        setFormError('Please enter a valid card number')
        return false
      }
      
      if (!paymentForm.nameOnCard.trim()) {
        setFormError('Name on card is required')
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      // Format the data for the API
      const formattedData: any = {
        type: paymentForm.type,
        isDefault: paymentForm.isDefault,
      }
      
      // Add card-specific details only if type is card
      if (paymentForm.type === 'card') {
        const cardNumberDigits = paymentForm.cardNumber.replace(/\D/g, '')
        formattedData.lastFour = cardNumberDigits.slice(-4)
        formattedData.cardType = paymentForm.cardType
        formattedData.expiryDate = `${paymentForm.expiryMonth}/${paymentForm.expiryYear.slice(-2)}`
      }
      
      if (editingPaymentId) {
        // Update existing payment method
        await updatePaymentMethod(editingPaymentId, formattedData)
        
        // If this is set as default, update it
        if (paymentForm.isDefault) {
          await setDefaultPaymentMethod(editingPaymentId)
        }
        
        setSuccessMessage('Payment method updated successfully')
      } else {
        // Add new payment method
        await addPaymentMethod(formattedData)
        setSuccessMessage('Payment method added successfully')
      }
      
      // Reset form after successful submission
      resetForm()
      
      // Refresh payment methods
      await fetchPaymentMethods()
    } catch (err) {
      // Error will be set in the store
    }
  }

  const handleEdit = (payment: PaymentMethod) => {
    // For security, we don't have the full card number from the API
    // Set up initial state based on payment type
    if (payment.type === 'card') {
      // Try to extract month and year from expiryDate (format: MM/YY)
      let expiryMonth = MONTHS[0].value
      let expiryYear = YEARS[0].value
      
      if (payment.expiryDate) {
        const [month, shortYear] = payment.expiryDate.split('/')
        if (month && shortYear) {
          expiryMonth = month
          expiryYear = `20${shortYear}` // Convert YY to 20YY
        }
      }
      
      setPaymentForm({
        type: 'card',
        cardNumber: payment.lastFour ? `•••• •••• •••• ${payment.lastFour}` : '',
        cardType: payment.cardType || 'visa',
        expiryMonth,
        expiryYear,
        nameOnCard: '',  // We don't have this data from the API
        isDefault: payment.isDefault,
      })
    } else {
      // For non-card payment methods
      setPaymentForm({
        ...initialPaymentFormState,
        type: payment.type,
        isDefault: payment.isDefault,
      })
    }
    
    setEditingPaymentId(payment.id)
    setShowAddForm(true)
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingPayment(id)
      await deletePaymentMethod(id)
      setSuccessMessage('Payment method deleted successfully')
      
      // Refresh payment methods
      await fetchPaymentMethods()
    } catch (err) {
      // Error will be set in the store
    } finally {
      setDeletingPayment(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id)
      setSuccessMessage('Default payment method updated')
      
      // Refresh payment methods
      await fetchPaymentMethods()
    } catch (err) {
      // Error will be set in the store
    }
  }

  // Renders the appropriate icon for each payment method type
  const renderPaymentIcon = (type: string, cardType?: string) => {
    if (type === 'card') {
      switch (cardType?.toLowerCase()) {
        case 'visa':
          return <span className="text-blue-600">Visa</span>
        case 'mastercard':
          return <span className="text-red-500">Mastercard</span>
        case 'amex':
          return <span className="text-blue-500">AmEx</span>
        case 'discover':
          return <span className="text-orange-500">Discover</span>
        default:
          return <CreditCard className="h-4 w-4" />
      }
    } else if (type === 'paypal') {
      return <span className="text-blue-700">PayPal</span>
    } else if (type === 'applepay') {
      return <span className="text-gray-900 dark:text-white">Apple Pay</span>
    } else if (type === 'googlepay') {
      return <span className="text-blue-500">Google Pay</span>
    }
    
    return <CreditCard className="h-4 w-4" />
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
            <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your payment options</p>
          </div>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
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
              <CardTitle>{editingPaymentId ? 'Edit Payment Method' : 'Add New Payment Method'}</CardTitle>
              <CardDescription>
                {editingPaymentId 
                  ? 'Update your existing payment information'
                  : 'Enter a new payment method for faster checkout'
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
                  <Label htmlFor="type">Payment Method Type</Label>
                  <Select 
                    value={paymentForm.type} 
                    onValueChange={(value) => handleSelectChange('type', value)}
                    disabled={!!editingPaymentId} // Can't change type when editing
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Show card-specific fields only if type is 'card' */}
                {paymentForm.type === 'card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentForm.cardNumber}
                        onChange={handleChange}
                        placeholder="•••• •••• •••• ••••"
                        disabled={!!editingPaymentId} // Can't change number when editing
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardType">Card Type</Label>
                      <Select 
                        value={paymentForm.cardType} 
                        onValueChange={(value) => handleSelectChange('cardType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CARD_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth">Expiry Month</Label>
                        <Select 
                          value={paymentForm.expiryMonth} 
                          onValueChange={(value) => handleSelectChange('expiryMonth', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map(month => (
                              <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiryYear">Expiry Year</Label>
                        <Select 
                          value={paymentForm.expiryYear} 
                          onValueChange={(value) => handleSelectChange('expiryYear', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map(year => (
                              <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        value={paymentForm.nameOnCard}
                        onChange={handleChange}
                        placeholder="Name as it appears on the card"
                        disabled={!!editingPaymentId} // Typically can't change name when editing
                      />
                    </div>
                  </>
                )}
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="isDefault"
                    checked={paymentForm.isDefault}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                    Set as default payment method
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
                    {editingPaymentId ? 'Update Payment Method' : 'Add Payment Method'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && !paymentMethods.length ? (
            // Show loading skeleton if loading and no payment methods yet
            [...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
          ) : paymentMethods.length > 0 ? (
            // Show payment methods
            paymentMethods.map((payment) => (
              <Card key={payment.id} className={payment.isDefault ? 'border-2 border-primary' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center text-base capitalize">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {payment.type}
                        {payment.isDefault && (
                          <Badge variant="default" className="ml-2">Default</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Payment Method</CardDescription>
                    </div>
                    {deletingPayment === payment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(payment.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center">
                      {renderPaymentIcon(payment.type, payment.cardType)}
                      
                      {payment.lastFour && (
                        <span className="ml-2">
                          ending in {payment.lastFour}
                        </span>
                      )}
                    </div>
                    
                    {payment.expiryDate && (
                      <p className="text-gray-500 dark:text-gray-400">
                        Expires: {payment.expiryDate}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(payment)}>
                    Edit
                  </Button>
                  {!payment.isDefault && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleSetDefault(payment.id)}
                      title="Set as default payment method"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Set as Default
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            // No payment methods
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Payment Methods Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't added any payment methods yet. Add your first payment method to get started.
                    </p>
                    {!showAddForm && (
                      <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment Method
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
import { migrationService } from './migration.service'
import { supabase } from './supabase'

class InitializationService {
  private initialized = false

  async initialize() {
    if (this.initialized) {
      return
    }

    console.log('Initializing services...')

    try {
      // Check Supabase connection
      await this.checkSupabaseConnection()

      // Run migrations (this would normally be done in a backend environment)
      // Here we're simulating it for demonstration purposes
      console.log('Migration tracking enabled, but migrations should be run manually in Supabase')

      this.initialized = true
      console.log('Services initialized successfully')
    } catch (error) {
      console.error('Initialization error:', error)
      throw error
    }
  }

  private async checkSupabaseConnection() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })

      if (error) {
        console.error('Supabase connection error:', error)
        throw new Error('Failed to connect to Supabase')
      }

      console.log('Successfully connected to Supabase')
    } catch (error) {
      console.error('Supabase connection check failed:', error)
      throw error
    }
  }
}

export const initService = new InitializationService()


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from '../contexts/DataContext';
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
});

const phoneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a 6-digit code."),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const StoreOwnerAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("google");
  const [verificationStep, setVerificationStep] = useState<"form" | "verification">("form");
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone" | null>(null);
  const [storeOwnerData, setStoreOwnerData] = useState<any>(null);
  
  const { loginStoreOwner } = useData();
  const navigate = useNavigate();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use the Google OAuth API
      // For this demo, we'll simulate a successful login
      await loginStoreOwner({
        id: 'google-auth-id',
        name: 'Store Owner',
        email: 'owner@example.com',
        provider: 'google'
      });
      navigate('/store-owner');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would send a verification code to the email
      // For this demo, we'll simulate sending a code
      setStoreOwnerData({
        name: values.name,
        email: values.email,
        provider: 'email'
      });
      setVerificationMethod("email");
      setVerificationStep("verification");
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${values.email}`,
      });
    } catch (error) {
      console.error('Email verification failed:', error);
      toast({
        title: "Failed to send code",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would send a verification code to the phone
      // For this demo, we'll simulate sending a code
      setStoreOwnerData({
        name: values.name,
        phone: values.phone,
        provider: 'phone'
      });
      setVerificationMethod("phone");
      setVerificationStep("verification");
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${values.phone}`,
      });
    } catch (error) {
      console.error('Phone verification failed:', error);
      toast({
        title: "Failed to send code",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would verify the code
      // For this demo, we'll simulate a successful verification with code "123456"
      if (values.otp === "123456") {
        // Add a unique ID for the store owner
        const storeOwnerId = `${verificationMethod}-${Date.now()}`;
        await loginStoreOwner({
          id: storeOwnerId,
          ...storeOwnerData,
        });
        toast({
          title: "Verification successful",
          description: "You have been logged in successfully",
        });
        navigate('/store-owner');
      } else {
        toast({
          title: "Invalid code",
          description: "The verification code you entered is incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setVerificationStep("form");
    setVerificationMethod(null);
  };

  // Render verification form
  if (verificationStep === "verification") {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Verify Your {verificationMethod === "email" ? "Email" : "Phone"}</h2>
        <p className="text-gray-600 mb-8 text-center">
          Enter the 6-digit code sent to your {verificationMethod === "email" ? "email" : "phone"}
        </p>
        
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="w-full space-y-6">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs text-center mt-2">
                    For demo purposes, use code: 123456
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                ) : null}
                Verify
              </Button>
              <Button type="button" variant="outline" onClick={handleBackToForm}>
                Back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Store Owner Login</h2>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8 w-full">
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google">
          <p className="text-gray-600 mb-8 text-center">
            Log in with your Google account to manage your store.
          </p>
          
          <Button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span className="ml-2">Continue with Google</span>
          </Button>
        </TabsContent>
        
        <TabsContent value="email">
          <p className="text-gray-600 mb-6 text-center">
            Enter your email address to receive a verification code.
          </p>
          
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                ) : null}
                Send Verification Code
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="phone">
          <p className="text-gray-600 mb-6 text-center">
            Enter your phone number to receive a verification code.
          </p>
          
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Store Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                ) : null}
                Send Verification Code
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreOwnerAuth;

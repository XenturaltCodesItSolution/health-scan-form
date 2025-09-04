import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PackageSelector } from "@/components/PackageSelector";
import { toast } from "@/hooks/use-toast";
import { Stethoscope, Users, Mail, Phone, MapPin, ShoppingCart, Percent } from "lucide-react";
import emailjs from "@emailjs/browser";

const healthPackages = [
  { id: "1", name: "Aarogyam Winter Basic with USTSH", price: 1199 },
  { id: "2", name: "COMPLETE HEALTH CHECK WITH VITAMINS", price: 1999 },
  { id: "3", name: "SENIOR CITIZEN PROFILE MALE", price: 2399 },
  { id: "4", name: "SENIOR CITIZEN PROFILE FEMALE", price: 2399 },
  { id: "5", name: "Aarogyam C plus with USTSH", price: 1799 },
  { id: "6", name: "Aarogyam D Plush with USTSH", price: 2999 },
  { id: "7", name: "Aarogyam E Plus with USTSH", price: 3599 },
  { id: "8", name: "Aarogyam F Plus with USTSH", price: 4599 },
  { id: "9", name: "Aarogyam Stree Profile with USTSH", price: 2599 },
  { id: "10", name: "Aarogyam Purush Profile With USTSH", price: 2599 },
  { id: "11", name: "Aarogyam X Plus With USTSH", price: 4599 },
  { id: "12", name: "Aarogyam XL Plus with USTSH", price: 5999 },
  { id: "13", name: "TOTAL HEALTH PROFILE PLUS", price: 1760 },
  { id: "14", name: "SUPER HEALTHY PACKAGE", price: 2599 },
  { id: "15", name: "HEALTHY 2025 PACKAGE", price: 2025 },
  { id: "16", name: "JAANCH HEART SCREEN ADVANCED", price: 1499 },
  { id: "17", name: "JAANCH - DIABETIC SCREEN", price: 1300 },
  { id: "18", name: "AAROGYAM CAMP 2", price: 1899 },
  { id: "19", name: "ALLERGY PANEL - FOOD, INHALANT, NON-VEG PLUS DRUG", price: 5500 },
  { id: "20", name: "JAANCH THYROID PROFILE - BASIC", price: 499 },
  { id: "21", name: "JAANCH CANCER SCREENING MALE ADVANCE", price: 1999 },
  { id: "22", name: "JAANCH - MENS HAIRFALL SCREENING ADVANCED", price: 2599 },
  { id: "23", name: "JAANCH - STD PROFILE BASIC", price: 2749 },
  { id: "24", name: "extensive full body health checkup", price: 3399 },
  { id: "25", name: "AAROGYAM TAX SAVER - BASIC WITH USTSH", price: 2599 },
  { id: "26", name: "JAANCH ANTENATAL PROFILE EXTENDED", price: 3999 },
  { id: "27", name: "COMPLETE VITAMIN PROFILE", price: 4999 },
  { id: "28", name: "JAANCH PCOD BASIC", price: 2899 },
  { id: "29", name: "JANCH PCOD ADVANCE", price: 4499 },
  { id: "30", name: "ARTHRITIS PROFILE ADVANCE", price: 4499 },
  { id: "31", name: "ANEMIA PROFILE ADVANCED", price: 4500 },
  { id: "32", name: "WOMEN ADVANCED PROFILE", price: 2399 },
  { id: "33", name: "DOCTOR RECOMMENDED FULL BODY CHECKUP-BASIC", price: 1699 },
  { id: "34", name: "SPORTS FITNESS - ADVANCE", price: 3850 },
  { id: "35", name: "AAROGYAM C PRO INCLUDING CRM", price: 2099 },
];

const formSchema = z.object({
  members: z.string().min(1, { message: "Please select number of members." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().optional(),
});

export function HealthcareBookingForm() {
  const navigate = useNavigate();
  const [memberPackages, setMemberPackages] = useState<Record<number, string[]>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const memberCount = parseInt(form.watch("members") || "0");

  const handlePackageToggle = (memberNumber: number, packageId: string) => {
    setMemberPackages(prev => {
      const currentPackages = prev[memberNumber] || [];
      const isSelected = currentPackages.includes(packageId);
      
      return {
        ...prev,
        [memberNumber]: isSelected
          ? currentPackages.filter(id => id !== packageId)
          : [...currentPackages, packageId]
      };
    });
  };

  const calculateTotalAmount = () => {
    let subtotal = 0;
    Object.values(memberPackages).forEach(packageIds => {
      packageIds.forEach(packageId => {
        const pkg = healthPackages.find(p => p.id === packageId);
        if (pkg) subtotal += pkg.price;
      });
    });
    return subtotal;
  };

  const getDiscountPercentage = () => {
    const memberCount = parseInt(form.watch("members")) || 0;
    if (memberCount === 2) return 10;
    if (memberCount >= 3) return 15;
    return 0;
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateTotalAmount();
    const discountPercentage = getDiscountPercentage();
    return (subtotal * discountPercentage) / 100;
  };

  const calculateFinalAmount = () => {
    return calculateTotalAmount() - calculateDiscountAmount();
  };

  const hasSelectedPackages = () => {
    return Object.values(memberPackages).some(packages => packages.length > 0);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!hasSelectedPackages()) {
      toast({
        title: "No packages selected",
        description: "Please select at least one package for any member.",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      email: values.email,
      phone: values.phone,
      address: values.address,
      memberPackages: Object.entries(memberPackages).map(([memberNum, packageIds]) => ({
        memberNumber: parseInt(memberNum),
        packages: packageIds.map(packageId => {
          const pkg = healthPackages.find(p => p.id === packageId)!;
          return {
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
          };
        }),
      })),
      subtotal: calculateTotalAmount(),
      discountPercentage: getDiscountPercentage(),
      discountAmount: calculateDiscountAmount(),
      totalAmount: calculateFinalAmount(),
      members: parseInt(values.members),
    };

    // Send booking notification email
    const emailData = {
      to_email: "aarogyamcentre1@gmail.com",
      customer_email: values.email,
      customer_phone: values.phone,
      customer_address: values.address || "Not provided",
      member_count: values.members,
      packages_list: Object.entries(memberPackages)
        .map(([memberNum, packageIds]) => {
          const packages = packageIds.map(packageId => {
            const pkg = healthPackages.find(p => p.id === packageId)!;
            return `${pkg.name} - ₹${pkg.price}`;
          });
          return `Member ${memberNum}: ${packages.join(", ")}`;
        }).join("\n"),
      subtotal: calculateTotalAmount(),
      discount_percentage: getDiscountPercentage(),
      discount_amount: calculateDiscountAmount(),
      final_amount: calculateFinalAmount(),
      booking_date: new Date().toLocaleString(),
    };

    // Initialize EmailJS
    emailjs.init("c6RF1yTiVVt5zT3iB");
    
    emailjs.send("znyksGpPI6f8hT0vAXPwX", "YOUR_TEMPLATE_ID", emailData)
      .then(() => {
        console.log("Booking notification sent successfully!");
      })
      .catch((error) => {
        console.error("Failed to send booking notification:", error);
      });

    navigate("/booking-summary", { state: bookingData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-medical border-0 bg-gradient-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              🎉 Special Deal: More Packages, Less Price
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Select multiple packages for each family member
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Number of Members
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Reset package selections when member count changes
                          setMemberPackages({});
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-card border-border hover:border-primary transition-colors">
                            <SelectValue placeholder="Select number of members" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Member' : 'Members'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {memberCount > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Select Packages for Each Member</h3>
                    </div>
                    {Array.from({ length: memberCount }, (_, i) => i + 1).map((memberNumber) => (
                      <PackageSelector
                        key={memberNumber}
                        memberNumber={memberNumber}
                        packages={healthPackages}
                        selectedPackages={memberPackages[memberNumber] || []}
                        onPackageToggle={handlePackageToggle}
                      />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="your.email@example.com"
                            className="h-12 bg-card border-border focus:border-primary transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="tel" 
                            placeholder="+91 9876543210"
                            className="h-12 bg-card border-border focus:border-primary transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Address (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter your complete address for home collection..."
                          className="min-h-20 bg-card border-border focus:border-primary transition-colors resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {hasSelectedPackages() && (
                  <Card className="bg-gradient-primary border-primary/20">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-center text-white">
                        <span className="text-lg">Subtotal:</span>
                        <span className="text-lg font-semibold">₹{calculateTotalAmount()}</span>
                      </div>
                      
                      {getDiscountPercentage() > 0 && (
                        <>
                          <div className="flex justify-between items-center text-green-200">
                            <span className="text-lg flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              Discount ({getDiscountPercentage()}%):
                            </span>
                            <span className="text-lg font-semibold">-₹{calculateDiscountAmount()}</span>
                          </div>
                          <div className="border-t border-white/20 pt-3">
                            <div className="flex justify-between items-center text-xl font-bold text-white">
                              <span>Final Amount:</span>
                              <span>₹{calculateFinalAmount()}</span>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {getDiscountPercentage() === 0 && (
                        <div className="flex justify-between items-center text-xl font-bold text-white">
                          <span>Total Amount:</span>
                          <span>₹{calculateTotalAmount()}</span>
                        </div>
                      )}
                      
                      {memberCount >= 2 && (
                        <div className="mt-4 p-3 bg-white/10 rounded-lg">
                          <p className="text-sm text-white/90 text-center">
                            🎉 {memberCount === 2 ? "10% discount applied for 2 members!" : "15% discount applied for 3+ members!"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-medical transition-all duration-300"
                  disabled={!hasSelectedPackages()}
                >
                  Review Booking
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
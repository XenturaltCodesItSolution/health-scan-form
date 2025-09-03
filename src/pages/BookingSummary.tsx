import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, User, Package, Mail, Phone, MapPin, CheckCircle, Heart, Sparkles, Calendar } from "lucide-react";

interface BookingData {
  email: string;
  phone: string;
  address?: string;
  memberPackages: {
    memberNumber: number;
    packages: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  totalAmount: number;
}

export default function BookingSummary() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as BookingData;

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const handleGoBack = () => {
    navigate("/");
  };

  const handleConfirmBooking = () => {
    setIsConfirmed(true);
    
    toast({
      title: "🎉 Congratulations!",
      description: "Your healthcare package booking has been confirmed successfully!",
    });

    // Scroll to top to show the congratulations message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/5 to-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-medical border-0 bg-gradient-card text-center">
            <CardHeader className="space-y-6 pb-8">
              <div className="mx-auto relative">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
                </div>
              </div>
              
              <div className="space-y-3">
                <CardTitle className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  🎉 Congratulations!
                </CardTitle>
                <CardDescription className="text-xl text-muted-foreground">
                  Your healthcare journey begins now
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              <div className="bg-gradient-primary/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Booking Confirmed Successfully</span>
                  <Heart className="w-5 h-5" />
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  Thank you for choosing our healthcare services! Your comprehensive health checkup packages 
                  have been booked and our team will contact you within 24 hours to schedule your appointment.
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Booking ID: HC-{Date.now().toString().slice(-6)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg">What's Next?</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>✅ You will receive a confirmation email shortly</p>
                  <p>✅ Our team will call you to schedule your appointment</p>
                  <p>✅ Prepare by fasting 12 hours before your test (if required)</p>
                  <p>✅ Carry a valid ID proof on the day of your visit</p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleGoBack}
                  className="w-full h-12 text-base bg-gradient-primary hover:shadow-medical transition-all duration-300"
                >
                  Book Another Package
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-medical border-0 bg-gradient-card">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Booking Summary
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Review your healthcare package selections
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-gradient-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{bookingData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{bookingData.phone}</span>
                </div>
                {bookingData.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <span>{bookingData.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Package Selections */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Selected Packages
              </h3>
              
              {bookingData.memberPackages.map((member) => (
                <Card key={member.memberNumber} className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">
                      Member {member.memberNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {member.packages.map((pkg) => (
                      <div key={pkg.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{pkg.name}</p>
                        </div>
                        <Badge variant="secondary" className="text-primary font-semibold">
                          ₹{pkg.price}
                        </Badge>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Member Total:</span>
                      <span className="text-primary">
                        ₹{member.packages.reduce((sum, pkg) => sum + pkg.price, 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total Amount */}
            <Card className="bg-gradient-primary border-primary/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Grand Total:</span>
                  <span>₹{bookingData.totalAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={handleGoBack}
                className="flex-1 h-12 text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </Button>
              <Button 
                onClick={handleConfirmBooking}
                className="flex-1 h-12 text-base bg-gradient-primary hover:shadow-medical transition-all duration-300"
              >
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
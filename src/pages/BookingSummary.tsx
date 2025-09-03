import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Package, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

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
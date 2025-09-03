import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User, Package } from "lucide-react";

interface HealthPackage {
  id: string;
  name: string;
  price: number;
}

interface PackageSelectorProps {
  memberNumber: number;
  packages: HealthPackage[];
  selectedPackages: string[];
  onPackageToggle: (memberNumber: number, packageId: string) => void;
}

export function PackageSelector({ 
  memberNumber, 
  packages, 
  selectedPackages, 
  onPackageToggle 
}: PackageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPackageDetails = packages.filter(pkg => selectedPackages.includes(pkg.id));
  const memberTotal = selectedPackageDetails.reduce((sum, pkg) => sum + pkg.price, 0);

  return (
    <Card className="border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Member {memberNumber}
              </CardTitle>
              <div className="flex items-center gap-3">
                {selectedPackages.length > 0 && (
                  <Badge variant="secondary" className="text-primary">
                    {selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''} - ₹{memberTotal}
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Package className="w-4 h-4" />
                Select multiple packages for this member
              </div>
              
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`${memberNumber}-${pkg.id}`}
                      checked={selectedPackages.includes(pkg.id)}
                      onCheckedChange={() => onPackageToggle(memberNumber, pkg.id)}
                    />
                    <label
                      htmlFor={`${memberNumber}-${pkg.id}`}
                      className="flex-1 cursor-pointer flex justify-between items-center"
                    >
                      <span className="font-medium text-sm">{pkg.name}</span>
                      <span className="text-primary font-semibold">₹{pkg.price}</span>
                    </label>
                  </div>
                ))}
              </div>

              {selectedPackages.length > 0 && (
                <div className="mt-4 p-3 bg-gradient-primary/5 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Member {memberNumber} Total:</span>
                    <span className="text-primary">₹{memberTotal}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
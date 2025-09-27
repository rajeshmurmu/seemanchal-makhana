import { Navigation, Building, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function MapAndLocationInfo() {
    return (
        <div className="space-y-6">
            <Card className="border-2 lg:w-1/2 mx-auto border-logo-200">
                <CardHeader>
                    <CardTitle className="text-logo-900 flex items-center">
                        <Navigation className="w-6 h-6 mr-2" />
                        Find Us
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-200 rounded-lg overflow-hidden h-64 flex items-center justify-center mb-6">
                        <div className="w-full h-full" >
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d933.3457579159034!2d87.63912253756077!3d25.54621106673999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39faaf601e88bbe5%3A0x19ea049053bd7fb6!2sMunna%20kumar!5e0!3m2!1sen!2sin!4v1758818994295!5m2!1sen!2sin" className="w-full h-full" style={{ border: 0 }} loading="lazy" ></iframe>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="my-4"><h2 className="text-xl text-logo-900 font-bold">Contact Information</h2></div>
                        <div className="flex items-start space-x-3">
                            <Building className="w-5 h-5 text-logo-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-logo-900">Landmarks</h4>
                                <p className="text-gray-700 text-sm">
                                    B.ed Seemanchal College Road, Katihar | Near Raksa Bathaili
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Phone className="w-5 h-5 text-logo-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-logo-900">Call Us</h4>
                                <p className="text-gray-700 text-sm">
                                    +91 96612 40793
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-logo-600 mt-1" />
                            <div>
                                <h4 className="font-medium text-logo-900">Email Us</h4>
                                <p className="text-gray-700 text-sm">
                                    info@seemanchalmakhana.com
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


        </div>
    )
}

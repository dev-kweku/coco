    "use client";

    import { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Star } from "lucide-react";

    interface ReviewFormProps {
    serviceId: string;
    onReviewAdded?: () => void;
    }

    export function ReviewForm({ serviceId, onReviewAdded }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
        const response = await fetch(`/api/services/${serviceId}/reviews`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating, comment }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess("Review added successfully!");
            setComment("");
            setRating(5);
            onReviewAdded?.();
        } else {
            setError(data.message || "Failed to add review");
        }
        } catch (error) {
        setError("An error occurred. Please try again.");
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <Card>
        <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>
            Share your experience with this service
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Rating</Label>
                <Select value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
                </Select>
                <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                    key={star}
                    className={`h-6 w-6 ${
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    />
                ))}
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                required
                />
            </div>
            
            {error && (
                <div className="text-destructive text-sm">{error}</div>
            )}
            
            {success && (
                <div className="text-green-600 text-sm">{success}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
            </form>
        </CardContent>
        </Card>
    );
    }
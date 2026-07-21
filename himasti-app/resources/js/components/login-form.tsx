import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto">
<div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#1C2032] text-xl font-bold text-white">H</div>
                    </div>
                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                        HIMASTI
                    </FieldSeparator>
                </CardHeader>
                <CardContent>
                    <FieldDescription className="mb-4 text-center">
                        Masuk menggunakan kredensial akun Anda.
                    </FieldDescription>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" type="email" required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <Input id="password" type="password" required />
                            </Field>
                            <Field>
                                <Button type="submit">Masuk</Button>
                                <Button variant="outline" type="button">
                                    Masuk dengan SSO
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

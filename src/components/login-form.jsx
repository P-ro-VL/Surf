import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập mã nhân sự bên dưới để tiếp tục
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="id">Mã nhân sự</Label>
          <Input id="id" type="text" placeholder="11223735" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" type="password" placeholder="" required />
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          Bắt đầu
        </Button>
      </div>
      <div className="text-center text-sm">
        Không thể đăng nhập? Hãy liên hệ với quản lý trực tiếp.{" "}
      </div>
    </form>
  );
}

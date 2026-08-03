import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Tìm kèo dễ dàng",
    description: "Nhiều kèo phù hợp với bạn mỗi ngày",
  },
  {
    title: "Kết nối nhanh chóng",
    description: "Giao lưu, kết nối cộng đồng bóng đá đam mê",
  },
  {
    title: "Công bằng & minh bạch",
    description: "Thông tin rõ ràng, chơi có trách nhiệm",
  },
];

export function PageIntro() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Kèo đấu</h1>
        <p className="text-sm text-muted-foreground">
          Tìm kèo hay – Gặp đối chất – Đá hết mình
        </p>
      </div>

      <Card>
        <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-start gap-3 border rounded-md p-3">
              <div className="h-8 w-8 shrink-0 rounded-md border" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

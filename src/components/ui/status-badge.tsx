export function Status({ value }: { value: string | number }) {
  return (
    <span
      className={"badge " + String(value).toLowerCase().replaceAll(" ", "-")}
    >
      {value}
    </span>
  );
}

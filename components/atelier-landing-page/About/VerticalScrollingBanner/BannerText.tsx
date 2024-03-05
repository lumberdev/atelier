const BannerText = ({ items }) => {
  return (
    <div className="flex flex-1 flex-col gap-[1.875rem] text-center text-4xl italic text-brand-2 md:text-start md:text-5xl lg:text-[3.5rem] xl:text-7xl [&>*]:font-brand-body [&>*]:font-light">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
};

export default BannerText;

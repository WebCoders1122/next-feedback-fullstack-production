interface Props {
  title: string;
  description: string;
}

export default function PageMetaData({ title, description }: Props) {
  return (
    <>
      <title>{title}</title>
      <meta
        name='description'
        content={description}
      />
    </>
  );
}

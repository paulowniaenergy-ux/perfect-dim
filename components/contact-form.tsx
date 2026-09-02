'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm({ propertyTitle }: { propertyTitle?: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="grid min-h-60 place-items-center bg-[#eef0e8] p-8 text-center">
        <div>
          <CheckCircle2 className="mx-auto size-10 text-[#728d55]" />
          <h3 className="mt-4 text-2xl text-[#173326]">Дякуємо за заявку</h3>
          <p className="mt-2 text-sm leading-6 text-[#617066]">Команда Perfect Dim зв’яжеться з вами найближчим часом.</p>
          <Button className="mt-5 rounded-none bg-[#173326] px-5 hover:bg-[#254b39]" onClick={() => setSent(false)}>Надіслати ще одну</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Ваше ім’я</Label>
        <Input id="name" name="name" required placeholder="Як до вас звертатися?" className="h-12 rounded-none bg-white" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Номер телефону</Label>
        <Input id="phone" name="phone" type="tel" required placeholder="+38 0__ ___ __ __" className="h-12 rounded-none bg-white" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Повідомлення</Label>
        <Textarea id="message" name="message" rows={3} defaultValue={propertyTitle ? `Цікавить об’єкт «${propertyTitle}»` : ''} className="min-h-24 rounded-none bg-white" />
      </div>
      <Button type="submit" className="h-13 rounded-none bg-[#c3a567] px-6 text-[#173326] hover:bg-[#d2b87f]">Отримати консультацію</Button>
      <p className="text-xs leading-5 text-[#748077]">Надсилаючи форму, ви погоджуєтесь на обробку контактних даних. У локальній демоверсії заявка нікуди не передається.</p>
    </form>
  );
}

import { z } from 'zod';
import { Contact } from '../models/Contact.js';
import { logAnalyticsEvent } from '../services/analytics.service.js';

export async function submit(req, res) {
  const schema = z.object({
    name: z.string().min(2).max(60),
    email: z.string().email(),
    message: z.string().min(5).max(2000),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const contact = await Contact.create(parsed.data);
  await logAnalyticsEvent({
    eventType: 'contact_submitted',
    metadata: { contactId: contact._id.toString(), email: contact.email },
  });

  return res.json({ ok: true, id: contact._id });
}


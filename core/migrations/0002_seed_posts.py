from django.db import migrations
from django.utils import timezone


def seed_posts(apps, schema_editor):
    Post = apps.get_model('core', 'Post')

    if Post.objects.exists():
        return

    posts = [
        {
            'title': 'دليلك الشامل للدراسة في ماليزيا',
            'slug': 'study-in-malaysia-guide',
            'excerpt': 'كل ما تحتاج معرفته عن الدراسة في ماليزيا من الألف للياء: الجامعات، التأشيرات، تكاليف المعيشة، وأفضل التخصصات للطلاب الدوليين.',
            'category': 'دليل',
            'hero_image': 'img/blog-1.jpg',
            'published_at': timezone.datetime(2025, 11, 20).date(),
            'content': """
                <p class="lead">ماليزيا واحدة من أفضل الوجهات التعليمية للطلاب الدوليين، حيث تجمع بين جودة التعليم وتكلفة المعيشة المعقولة.</p>
                <h2 id="why-malaysia">لماذا الدراسة في ماليزيا؟</h2>
                <ul>
                    <li><strong>جودة التعليم:</strong> جامعات معترف بها دوليًا بمعايير تعليمية عالية.</li>
                    <li><strong>تكلفة معقولة:</strong> رسوم دراسية ومعيشة أقل مقارنة بالدول الأخرى.</li>
                    <li><strong>لغة الدراسة:</strong> معظم البرامج متاحة باللغة الإنجليزية.</li>
                </ul>
                <h2 id="admission">شروط القبول</h2>
                <p>تختلف الشروط حسب المستوى الدراسي، لكن غالبًا ما تحتاج إلى شهادة ثانوية أو بكالوريوس وسجل أكاديمي جيد.</p>
                <h2 id="costs">تكاليف الدراسة والمعيشة</h2>
                <p>الرسوم الدراسية السنوية للبكالوريوس تبدأ من 3500 دولار، بينما المعيشة الشهرية بين 450-800 دولار.</p>
                <h2 id="visa">إجراءات التأشيرة</h2>
                <p>بعد الحصول على القبول الجامعي، يتم التقديم على تأشيرة الطالب (Student Pass) والتي تستغرق عادة 4-8 أسابيع.</p>
            """,
        },
        {
            'title': 'أفضل الجامعات الماليزية للطلاب الدوليين',
            'slug': 'best-malaysian-universities',
            'excerpt': 'تعرف على أفضل الجامعات في ماليزيا والتخصصات المتاحة، مع مقارنة بين الجودة والتكلفة والاعتماد الدولي.',
            'category': 'جامعات',
            'hero_image': 'img/blog-2.jpg',
            'published_at': timezone.datetime(2025, 11, 15).date(),
            'content': """
                <p>تضم ماليزيا جامعات مرموقة مثل University of Malaya وAPU وMMU، تقدم برامج حديثة ومعتمدة عالميًا.</p>
                <p>يتميز النظام التعليمي بوجود شراكات مع جامعات بريطانية وأسترالية تمنح شهادات مزدوجة.</p>
            """,
        },
        {
            'title': 'تكلفة المعيشة والدراسة في ماليزيا',
            'slug': 'cost-of-living-malaysia',
            'excerpt': 'دليل شامل لتكاليف الدراسة والسكن والمعيشة في ماليزيا مع نصائح للتخطيط المالي الذكي.',
            'category': 'تكاليف',
            'hero_image': 'img/blog-3.jpg',
            'published_at': timezone.datetime(2025, 11, 10).date(),
            'content': """
                <p>تتراوح الرسوم الدراسية بين 3500 و8000 دولار سنويًا حسب الجامعة والتخصص.</p>
                <p>تكاليف السكن تتراوح بين 800 - 1500 رنجت شهريًا، بينما المواصلات العامة اقتصادية ومتوفرة.</p>
            """,
        },
    ]

    for post_data in posts:
        Post.objects.create(**post_data)


def unseed_posts(apps, schema_editor):
    Post = apps.get_model('core', 'Post')
    slugs = ['study-in-malaysia-guide', 'best-malaysian-universities', 'cost-of-living-malaysia']
    Post.objects.filter(slug__in=slugs).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_posts, reverse_code=unseed_posts),
    ]

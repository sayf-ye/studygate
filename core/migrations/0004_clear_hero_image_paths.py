from django.db import migrations


def clear_hero_images(apps, schema_editor):
    Post = apps.get_model('core', 'Post')
    Post.objects.update(hero_image=None)


def noop_reverse(apps, schema_editor):
    # No-op reverse; existing images can be re-uploaded manually.
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0003_alter_post_hero_image'),
    ]

    operations = [
        migrations.RunPython(clear_hero_images, noop_reverse),
    ]

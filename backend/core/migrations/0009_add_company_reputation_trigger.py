from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_remove_internship_internship_company_or_text_required_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            """
            CREATE OR REPLACE FUNCTION update_company_reputation()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE core_company
                SET reputation_score = (
                    SELECT
                        COALESCE(SUM(
                            CASE
                                WHEN dr.verdict = 'scam' THEN -10
                                ELSE 2
                            END
                        ), 0)
                    FROM core_internship i
                    LEFT JOIN core_detectionresult dr
                        ON dr.internship_id = i.id
                    WHERE i.company_id = core_company.id
                )
                WHERE id = (
                    SELECT company_id
                    FROM core_internship
                    WHERE id = NEW.internship_id
                );

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            """,
            reverse_sql="DROP FUNCTION IF EXISTS update_company_reputation();"
        ),

        migrations.RunSQL(
            """
            DROP TRIGGER IF EXISTS company_reputation_trigger
            ON core_detectionresult;

            CREATE TRIGGER company_reputation_trigger
            AFTER INSERT OR UPDATE ON core_detectionresult
            FOR EACH ROW
            EXECUTE FUNCTION update_company_reputation();
            """,
            reverse_sql="""
            DROP TRIGGER IF EXISTS company_reputation_trigger
            ON core_detectionresult;
            """
        )
    ]